import {ChildProcess, spawn} from "child_process";
import * as express from "express";
import * as crypto from "crypto";

import { getUserPath  } from "../../helper/path-helper";
import connection from "../../connection";

const dockerInstance: {
    [key: string]: IDockerInstance;
} = {};

interface IDockerInstance {
    process: ChildProcess;
    stdout: IDockerOutput[];
    stderr: IDockerOutput[];
}

interface IDockerOutput {
    data: string;
    index: number;
    closed: boolean;
}

const run = async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    if(!id) { res.status(400).send("no projects"); return;}

    const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
    if(rows.length != 1) { res.status(400).send("no data"); return; }
    const result = rows[0];

    const sourcePath = getUserPath({...user, ...result});
    console.log(sourcePath);
    const docker = spawn("docker", ["run", "--rm", "-v", `${sourcePath}:/src`, "java-build:1.0"]);

    const hash = crypto.createHmac("sha256", "")
        .update(new Date().toString())
        .digest("hex"); // hash value for seperate result

    res.status(201).json({ hash }); // send result hash

    dockerInstance[hash] = {
        process: docker,
        stdout: [],
        stderr: [],
    };

    docker.stdout.on("data", (data) => {
        console.log(data);
        dockerInstance[hash]
            .stdout
            .push({
                data: data.toString(),
                index: dockerInstance[hash].stdout.length,
                closed: false,
            });
    });

    docker.stdout.on("end", () => {
        dockerInstance[hash]
            .stdout
            .push({
                data: "",
                index: dockerInstance[hash].stdout.length,
                closed: true,
            });
    });

    docker.stderr.on("data", (data) => {
        console.log(data);
        dockerInstance[hash]
            .stderr
            .push({
                data: data.toString(),
                index: dockerInstance[hash].stderr.length,
                closed: false,
            });
    });

    docker.stderr.on("end", () => {
        if (dockerInstance[hash].stderr.length === 0) {
            return;
        }

        dockerInstance[hash]
            .stderr
            .push({
                data: "",
                index: dockerInstance[hash].stderr.length,
                closed: true,
            });
    });
};


const result = async (req: express.Request, res: express.Response) => {
    const hash = req.params.hash;
    if (!dockerInstance[hash]) {
        res
            .status(404)
            .end();
        return;
    }
    
    console.log(dockerInstance[hash]);

    if (dockerInstance[hash].stderr.length > 0) {
        res
            .status(200)
            .json({
                err: true,
                data: dockerInstance[hash].stderr[0].data,
                index: 0,
                closed: dockerInstance[hash].stderr[0].closed,
            });
    } else {
        console.log(0, dockerInstance[hash].stdout[0]);
        res
            .status(200)
            .json({
                err: false,
                data: dockerInstance[hash].stdout[0].data,
                index: 0,
                closed: dockerInstance[hash].stdout[0].closed,
            });
    }
};

export const runEndPoint = {
    run,
    result,
};
