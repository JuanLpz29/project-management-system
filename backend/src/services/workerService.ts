import db from "../database/db";
import { Worker } from "../types";

export const createWorker = (
  name: string,
  role: string,
  seniority: string
): Worker => {
  const stmt = db.prepare(`
    INSERT INTO workers (name, role, seniority)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(name, role, seniority);

  return {
    id: result.lastInsertRowid as number,
    name,
    role,
    seniority
  };
};

export const getAllWorkers = (): Worker[] => {
  const workers = db.prepare(`
    SELECT id, name, role, seniority
    FROM workers
  `).all();

  return workers.map((worker: any) => ({
    id: worker.id,
    name: worker.name,
    role: worker.role,
    seniority: worker.seniority
  }));
};