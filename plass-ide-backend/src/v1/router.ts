import * as express from "express";
import {authenticate} from "./auth";
import {authEndPoint, fileEndPoint, problemEndPoint, runEndPoint} from "./endPoints";
import { ProjectsEndPoint } from "./endPoints/projects";

const router = express.Router();

router.get("/signout", authEndPoint.signout);

router.get("/verify", authenticate, authEndPoint.verify);

router.post("/signin", authEndPoint.signin);

router.get("/files", authenticate, fileEndPoint.getFileNames);

router.get("/files/*", authenticate, fileEndPoint.getFile);

router.post("/files", authenticate, fileEndPoint.postFile);

router.put("/files/*", authenticate, fileEndPoint.putFile);

router.delete("/files/*", authenticate, fileEndPoint.deleteFile);

router.post("/rename", authenticate, fileEndPoint.renameFile);

router.post("/run", authenticate, runEndPoint.run);

router.get("/run/result/:hash", authenticate, runEndPoint.result);

router.get("/problems", problemEndPoint.getProblems);

router.get("/problems/:id", problemEndPoint.getProblem);

router.get("/projects", authenticate, ProjectsEndPoint.getProjects);
router.post("/projects", authenticate, ProjectsEndPoint.postProjects);
router.get("/projects/:id", authenticate, ProjectsEndPoint.getProject);

export {router};
