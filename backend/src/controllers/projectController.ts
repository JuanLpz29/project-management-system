import { Request, Response } from "express";
import {
  createProject,
  getAllProjects,
  assignWorkerToProject
} from "../services/projectService";

export const handleCreateProject = (req: Request, res: Response) => {
  const { name, client, startDate, endDate } = req.body;

  if (!name || !client || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const project = createProject(name, client, startDate, endDate);
  res.status(201).json(project);
};

export const handleGetProjects = (_: Request, res: Response) => {
  const projects = getAllProjects();
  res.json(projects);
};

export const handleAssignWorker = (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const { workerId } = req.body;

  if (!workerId) {
    return res.status(400).json({ message: "workerId is required" });
  }

  try {
    assignWorkerToProject(projectId, workerId);
    res.status(204).send();
  } catch (error: any) {
    switch (error.message) {
      case "PROJECT_NOT_FOUND":
        return res.status(404).json({ message: "Project not found" });
      case "WORKER_NOT_FOUND":
        return res.status(404).json({ message: "Worker not found" });
      case "ASSIGNMENT_ALREADY_EXISTS":
        return res.status(409).json({ message: "Worker already assigned" });
      default:
        return res.status(500).json({ message: "Internal server error" });
    }
  }
};