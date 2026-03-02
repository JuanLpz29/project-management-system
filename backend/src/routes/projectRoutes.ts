import { Router } from "express";
import {
  handleCreateProject,
  handleGetProjects,
  handleAssignWorker
} from "../controllers/projectController";

const router = Router();

router.post("/", handleCreateProject);
router.get("/", handleGetProjects);
router.post("/:projectId/workers", handleAssignWorker);

export default router;