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

export const getWorkerById = (id: number): Worker => {
  const worker = db
    .prepare(`
      SELECT id, name, role, seniority
      FROM workers
      WHERE id = ?
    `)
    .get(id) as Worker | undefined;

  if (!worker) {
    throw new Error("WORKER_NOT_FOUND");
  }

  return {
    id: worker.id,
    name: worker.name,
    role: worker.role,
    seniority: worker.seniority
  };
};

export const deleteWorker = (id: number): void => {
  const worker = db
    .prepare("SELECT id FROM workers WHERE id = ?")
    .get(id);

  if (!worker) {
    throw new Error("WORKER_NOT_FOUND");
  }

  db.prepare("DELETE FROM workers WHERE id = ?").run(id);
};