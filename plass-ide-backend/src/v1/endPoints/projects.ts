import * as express from "express";
import {join} from "path";
import { mkdirSync } from "fs";
import connection from "../../connection";
import * as crypto from "crypto";


// 파일 저장 디렉토리
const fileDir = join(__dirname, "../../../files");

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
        
        mkdirSync(`${fileDir}/${user.username}/${path}`);
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const getProject = function(req: express.Request, res: express.Response) {

}

const putProject = function(req: express.Request, res: express.Response) {

}

const deleteProject = function(req: express.Request, res: express.Response) {

}

const getProjectFile = function(req: express.Request, res: express.Response) {

}

const postProjectFile = function(req: express.Request, res: express.Response) {

}

const putProjectFile = function(req: express.Request, res: express.Response) {

}

const deleteProjectFile = function(req: express.Request, res: express.Response) {

}

export const ProjectsEndPoint = {
    getProjects,
    postProjects,
    getProject,
    putProject,
    deleteProject,
    getProjectFile,
    postProjectFile,
    putProjectFile,
    deleteProjectFile
}