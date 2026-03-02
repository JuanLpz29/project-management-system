import { Request, Response } from "express";
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  deleteWorker
} from "../services/workerService";

export const handleCreateWorker = (req: Request, res: Response) => {
  const { name, role, seniority } = req.body;

  if (!name || !role || !seniority) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const worker = createWorker(name, role, seniority);
  res.status(201).json(worker);
};

export const handleGetWorkers = (_: Request, res: Response) => {
  const workers = getAllWorkers();
  res.json(workers);
};

export const handleGetWorkerById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const worker = getWorkerById(id);
    res.json(worker);
  } catch (error: any) {
    if (error.message === "WORKER_NOT_FOUND") {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteWorker = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    deleteWorker(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "WORKER_NOT_FOUND") {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};