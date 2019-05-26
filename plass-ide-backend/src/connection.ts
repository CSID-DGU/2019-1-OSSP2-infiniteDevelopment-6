import mysql from "mysql2";
import dbConfig from "../config/database";

export default mysql.createConnection(dbConfig);
