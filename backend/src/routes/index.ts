import { Router } from "express";
import projectRoutes from "./projectRoutes";
import workerRoutes from "./workerRoutes";

const router = Router();

router.use("/projects" , projectRoutes);
router.use("/workers" , workerRoutes);

export default router;