import * as express from "express";
import {join} from "path";
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync, readFileSync, unlinkSync, renameSync } from "fs";
import * as rimraf from 'rimraf';
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
    
    return _getFiles(path);
}


const getProjects = async function(req: express.Request, res: express.Response) {
    const { user } = req.user;


    try {
        const [rows] = await connection.execute("SELECT * FROM projects where user = ? AND enabled = true", [user.id]);

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
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
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
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
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
    const { name, category, enabled } = req.body;
    if(!id) { res.status(400).send("id is not integer"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
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

const deleteProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ?", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0]

        await connection.execute("UPDATE projects SET enabled = 0 WHERE id = ?", [id]);

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const getProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];

    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }
    if(!path) { res.status(400).send("no file path"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;

        if(!existsSync(_path)) {
            res.status(400).send("no file");
            return;
        }

        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        const name = _path.substring(_path.lastIndexOf("/") + 1);

        const file: IFile = {name, isDirectory}
        
        if(isDirectory) {
            file.files = getFiles(_path);
        } else {
            const filebuffer = readFileSync(_path);
            file.data = filebuffer.toString('utf8');
        }
        
        res.status(200).send(file);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const putProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];
    const { data, name } = req.body;

    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }
    if(!path) { res.status(400).send("no file path"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;
        

        if(!existsSync(_path)) {
            res.status(400).send("no file");
            return;
        }
        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        
        if(!isDirectory && data) {
            writeFileSync(_path, data);
        }

        if(name) {
            const directoryPath = _path.substring(0, _path.lastIndexOf("/"));
            const newName = `${directoryPath}/${name}`;
            console.log(newName)
            renameSync(_path, newName);
        }

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const deleteProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];

    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }
    if(!path) { res.status(400).send("no file path"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;

        if(!existsSync(_path)) {
            res.status(400).send("no file");
            return;
        }
        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        
        if(isDirectory) {
            rimraf.sync(_path);
        } else {
            unlinkSync(_path);
        }

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
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