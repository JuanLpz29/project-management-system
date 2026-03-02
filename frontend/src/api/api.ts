import type { Project, Worker } from "../types";

export const getProjects = async () => {
    const res = await fetch("/api/projects");
    return res.json();
  };
  
  export const getWorkers = async () => {
    const res = await fetch("/api/workers");
    return res.json();
  };
  
  export const createProject = async (
    data: Omit<Project, "id" | "workers">
  ) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  
    return res.json();
  };
  
  export const createWorker = async (
    data: Omit<Worker, "id">
  ) => {
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  
    return res.json();
  };
  
  export const assignWorker = async (
    projectId: number,
    workerId: number
  ) => {
    await fetch(`/api/projects/${projectId}/workers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId })
    });
  };