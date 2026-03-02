import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const schemaPath = path.resolve(__dirname, "./schema.sql");

const db = new Database(dbPath);
console.log("Database initialized");

const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);

export default db;