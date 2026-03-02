import db from "../database/db";
import { Project, Worker } from "../types";

export const createProject = (
  name: string,
  client: string,
  startDate: string,
  endDate: string
): Project => {
  const stmt = db.prepare(`
    INSERT INTO projects (name, client, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(name, client, startDate, endDate);

  return {
    id: result.lastInsertRowid as number,
    name,
    client,
    startDate,
    endDate,
    workers: []
  };
};

export const getAllProjects = (): Project[] => {
  const projects = db.prepare(`
    SELECT id, name, client, start_date, end_date
    FROM projects
  `).all();

  return projects.map((project: any) => {
    const workers: Worker[] = db.prepare(`
      SELECT w.id, w.name, w.role, w.seniority
      FROM workers w
      INNER JOIN project_workers pw
      ON w.id = pw.worker_id
      WHERE pw.project_id = ?
    `).all(project.id) as Worker[];

    return {
      id: project.id,
      name: project.name,
      client: project.client,
      startDate: project.start_date,
      endDate: project.end_date,
      workers
    };
  });
};

export const assignWorkerToProject = (
  projectId: number,
  workerId: number
): void => {
  // We verify if the project exists
  const project = db
    .prepare("SELECT id FROM projects WHERE id = ?")
    .get(projectId);

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  // We verify if the worker exists
  const worker = db
    .prepare("SELECT id FROM workers WHERE id = ?")
    .get(workerId);

  if (!worker) {
    throw new Error("WORKER_NOT_FOUND");
  }

  // We try to insert the relationship between the project and the worker
  try {
    db.prepare(`
      INSERT INTO project_workers (project_id, worker_id)
      VALUES (?, ?)
    `).run(projectId, workerId);
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      throw new Error("ASSIGNMENT_ALREADY_EXISTS");
    }
    throw error;
  }
};