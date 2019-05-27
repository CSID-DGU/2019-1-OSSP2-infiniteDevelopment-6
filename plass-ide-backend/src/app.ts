import * as express from "express";
import * as http from "http";
import * as cookieParser from "cookie-parser";

import {auth} from "./auth";
import {router} from "./v1/router";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

const server = http.createServer(app);

app.use(cookieParser());
app.use(auth.initialize());

app.use("/api", router);

server.listen(port, () => {
    console.log("server is listening on port " + port);
});
