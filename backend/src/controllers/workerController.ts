import { Request, Response } from "express";
import { createWorker, getAllWorkers } from "../services/workerService";

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