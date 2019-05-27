import * as express from "express";
import {existsSync, lstatSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync} from "fs";
import {join} from "path";
import {checkFileNameValid} from "../../Util";
import {IDirectoryNodes} from "../interface";
import connection from "../../connection";


// 파일 저장 디렉토리
const fileDir = join(__dirname, "../../../files");

const getProjects = async function(req: express.Request, res: express.Response) {
    const [rows] = await connection.execute("SELECT * FROM projects where user = ")
}

const postProjects = function(req: express.Request, res: express.Response) {

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