import * as express from "express";
import {auth} from "../../auth";
import connection from "../../connection";

const signin = async (req: express.Request, res: express.Response) => {
    if (req.body.userId === undefined || req.body.userPw === undefined) { res.status(400).send({}); return; }
    
    const user = req.body.userId;
    const password = req.body.userPw;
    
    try {
        const [rows] = await connection.execute("SELECT * FROM users WHERE username = ? AND password = ?", [ user, password ]);
        
        if (rows.length != 1) {
            res.status(400).send();
            return;
        }

        const token = auth.signToken({ user: rows[0] });

        res.cookie("token", token).status(200).send(rows[0]);
    } catch (e) {
        console.log(e);
    }
};

const signup = async (req: express.Request, res: express.Response) => {
    const {
        username, password, name, studentID, email, birth
    } = req.body;
    console.log(username);

    if(username === undefined || password === undefined || name === undefined ||
         studentID === undefined || email === undefined || birth === undefined ) { res.status(400).send({}); return;}

    try {
        await connection.execute(`INSERT INTO users (username, password, name, student_id, email, birth, grade, school) 
        values (?, ?, ?, ?, ?, ?, ?, ?)`, [ username, password, name, studentID, email, birth, 0, "동국대학교" ]);

        res.status(200).send();
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

const signout = (req: express.Request, res: express.Response) => {
    res
        .clearCookie("token")
        .set("location", "/")
        .status(200)
        .end();
};

const verify = (req: express.Request, res: express.Response) => {
    res
        .status(200)
        .send({...req.user.user});
};

export const authEndPoint = {
    signin,
    signout,
    verify,
    signup
};
