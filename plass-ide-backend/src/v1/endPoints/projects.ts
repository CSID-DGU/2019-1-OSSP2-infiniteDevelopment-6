import * as express from "express";
import {join} from "path";
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from "fs";
import connection from "../../connection";
import * as crypto from "crypto";

import { IFile } from "../../types";


// 파일 저장 디렉토리
const fileDir = join(__dirname, "../../../files");

// get path 
function getUserPath({username, path}: {username: string, path: string}) {
    return `${fileDir}/${username}/${path}`;
}

/**
 * get all files in directory
 * implments by recursive function
 */
function getFiles(path: string): Array<IFile> {
    return _getFiles(path);
}
function _getFiles(path: string): Array<IFile> {
    const result = readdirSync(path);
    const files: Array<IFile> = result.map((name: string):IFile => {
        const _path = `${path}/${name}`;
        const state = statSync(_path);
        const isDirectory = state.isDirectory();

        const file: IFile = { name, isDirectory };

        if(isDirectory) {
            file.files = _getFiles(_path);
        } else {
            file.size = state.size;
            const lastIndex = name.lastIndexOf(".");
            if(lastIndex != -1) {
                file.ext = name.substring(lastIndex + 1);
            }
        }

        return file;
    });

    return files
}


const getProjects = async function(req: express.Request, res: express.Response) {
    const { user } = req.user;


    try {
        const [rows] = await connection.execute("SELECT * FROM projects where user = ?", [user.id]);

        res.json(rows);
    } catch (e) {
        res.status(400).send();
    }
    
}

const postProjects = async function(req: express.Request, res: express.Response) {
    const { name, category } = req.body;
    const { user } = req.user;
    if(!name || !category) { res.status(400).send(); return; }
    
    const path = crypto.createHash("md5").update(new Date().toString()).digest("hex").substring(0, 40);

    try {
        await connection.execute("INSERT INTO projects(name, category, user, path) VALUES (?, ?, ?, ?)", [name, category, user.id, path]);
        
        mkdirSync(getUserPath({...user, path}));
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const getProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }


    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ?", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no data"); return; }
        const result = rows[0];

        const path = getUserPath({...user, ...result});
        const files: Array<IFile> = getFiles(path);

        res.status(200).send({
            ...result,
            files
        });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const postProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    const { filename, data, path, isDirectory } = req.body;
    if(!id) { res.status(400).send("id is not integer"); return; }
    if(!filename || !data) { res.status(400).send("no data"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ?", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _filename = `${userpath}${path}/${filename}`;

        if(existsSync(_filename)) {
            res.status(400).send("file is exists");
            return;
        } 

        if(isDirectory) {
            mkdirSync(_filename);
        } else {
            writeFileSync(_filename, data);
        }

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const putProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    const { name, category } = req.body;
    if(!id) { res.status(400).send("id is not integer"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ?", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0]
        
        const _name = name ? name : result.name;
        const _category = category ? category : result.category;

        await connection.execute("UPDATE projects SET name = ?, category = ? WHERE id = ?", [_name, _category, id]);

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const deleteProject = function(req: express.Request, res: express.Response) {

}

const getProjectFile = function(req: express.Request, res: express.Response) {

}


const putProjectFile = function(req: express.Request, res: express.Response) {

}

const deleteProjectFile = function(req: express.Request, res: express.Response) {

}

export const ProjectsEndPoint = {
    getProjects,
    postProjects,
    getProject,
    postProject,
    putProject,
    deleteProject,
    getProjectFile,
    putProjectFile,
    deleteProjectFile
}