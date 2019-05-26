import * as express from "express";
import {auth} from "../../auth";
import connection from "../../connection";

const signin = async (req: express.Request, res: express.Response) => {
    if (req.body.userId === undefined || req.body.userPw === undefined) { res.status(400).send({}); return; }
    
    const userId = req.body.userId;
    const userPw = req.body.userPw;
    
    try {
        const [rows] = await connection.execute("SELECT * FROM users WHERE username = ? AND password = ?", [ userId, userPw ]);
        
        if (rows.length != 1) {
            res.status(400).send();
            return;
        }

        const token = auth.signToken({
            userId: req.body.userId,
        });

        res.cookie("token", token).status(200).send(rows[0]);
    } catch (e) {
        console.log(e);
    }
};

const signout = (req: express.Request, res: express.Response) => {
    res
        .clearCookie("token")
        .set("location", "/")
        .status(302)
        .end();
};

const verify = (req: express.Request, res: express.Response) => {
    res
        .status(200)
        .end();
};

export const authEndPoint = {
    signin,
    signout,
    verify,
};
