import { Router } from "express";
import {
  handleCreateWorker,
  handleGetWorkers,
  handleGetWorkerById,
  handleDeleteWorker
} from "../controllers/workerController";

const router = Router();

router.post("/", handleCreateWorker);
router.get("/", handleGetWorkers);
router.get("/:id", handleGetWorkerById);
router.delete("/:id", handleDeleteWorker);

export default router;