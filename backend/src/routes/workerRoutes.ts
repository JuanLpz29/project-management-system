import { Router } from "express";
import {
  handleCreateWorker,
  handleGetWorkers
} from "../controllers/workerController";

const router = Router();

router.post("/", handleCreateWorker);
router.get("/", handleGetWorkers);

export default router;