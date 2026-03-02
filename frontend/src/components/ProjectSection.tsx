import { useEffect, useState, type SubmitEventHandler } from "react";
import Calendar from "react-calendar";
import type { Project, Worker } from "../types";
import {
  getProjects,
  getWorkers,
  createProject,
  assignWorker
} from "../api/api";
import ProjectsModal from "./ProjectsModal";

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name: string;
    client: string;
    startDate: string;
    endDate: string;
  }>({ name: "", client: "", startDate: "", endDate: "" });
  const [form, setForm] = useState({
    name: "",
    client: "",
    startDate: "",
    endDate: ""
  });

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsData, workersData] = await Promise.all([
          getProjects(),
          getWorkers()
        ]);
        setProjects(projectsData);
        setWorkers(workersData);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const nameError = !form.name.trim() ? "Required" : "";
    const clientError = !form.client.trim() ? "Required" : "";
    const startDateError = !form.startDate ? "Required" : "";
    const endDateError = !form.endDate ? "Required" : "";
    setFieldErrors({
      name: nameError,
      client: clientError,
      startDate: startDateError,
      endDate: endDateError
    });
    if (nameError || clientError || startDateError || endDateError) return;
    await createProject(form);
    setForm({ name: "", client: "", startDate: "", endDate: "" });
    setFieldErrors({ name: "", client: "", startDate: "", endDate: "" });
    setSuccessMessage("Project created successfully.");
    loadProjects();
  };

  useEffect(() => {
    if (!successMessage) return;
    const id = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(id);
  }, [successMessage]);

  const handleAssign = async (projectId: number, workerId: number) => {
    await assignWorker(projectId, workerId);
    loadProjects();
  };

  const formatDateForCalendar = (value: unknown): string => {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return "";
  };

  const handleOpenModal = async () => {
    const [projectsData, workersData] = await Promise.all([
      getProjects(),
      getWorkers()
    ]);
    setProjects(projectsData);
    setWorkers(workersData);
    setModalOpen(true);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Add a project here</h2>

      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="space-y-3 max-w-xs w-full">
        <div>
          <label htmlFor="project-name" className="block text-xs font-medium text-slate-700 mb-0.5">
            Name
          </label>
          <input
            id="project-name"
            placeholder="Project name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
              if (successMessage) setSuccessMessage("");
            }}
            className="input-field"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "project-name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="project-name-error" className="text-sm text-red-600 mt-0.5" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="project-client" className="block text-xs font-medium text-slate-700 mb-0.5">
            Client
          </label>
          <input
            id="project-client"
            placeholder="Client"
            value={form.client}
            onChange={(e) => {
              setForm({ ...form, client: e.target.value });
              if (fieldErrors.client) setFieldErrors((prev) => ({ ...prev, client: "" }));
              if (successMessage) setSuccessMessage("");
            }}
            className="input-field"
            aria-invalid={!!fieldErrors.client}
            aria-describedby={fieldErrors.client ? "project-client-error" : undefined}
          />
          {fieldErrors.client && (
            <p id="project-client-error" className="text-sm text-red-600 mt-0.5" role="alert">
              {fieldErrors.client}
            </p>
          )}
        </div>
        <div className="relative">
          <label className="block text-xs font-medium text-slate-700 mb-0.5" id="project-start-date-label">
            Start Date
          </label>
          <button
            type="button"
            onClick={() => {
              setEndDateOpen(false);
              setStartDateOpen((prev) => !prev);
            }}
            className="date-trigger"
            aria-invalid={!!fieldErrors.startDate}
            aria-describedby={fieldErrors.startDate ? "project-start-date-error" : undefined}
          >
            {form.startDate || "Select start date"}
          </button>
          {fieldErrors.startDate && (
            <p id="project-start-date-error" className="text-sm text-red-600 mt-0.5" role="alert">
              {fieldErrors.startDate}
            </p>
          )}
          {startDateOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setStartDateOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-lg [&_.react-calendar]:text-xs [&_.react-calendar]:scale-90 [&_.react-calendar]:origin-top-left">
                <Calendar
                  value={form.startDate ? new Date(form.startDate) : null}
                  onChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      startDate: formatDateForCalendar(value)
                    }));
                    if (fieldErrors.startDate) setFieldErrors((prev) => ({ ...prev, startDate: "" }));
                    if (successMessage) setSuccessMessage("");
                    setStartDateOpen(false);
                  }}
                  className="rounded-lg border-0 overflow-hidden"
                />
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <label className="block text-xs font-medium text-slate-700 mb-0.5" id="project-end-date-label">
            End Date
          </label>
          <button
            type="button"
            onClick={() => {
              setStartDateOpen(false);
              setEndDateOpen((prev) => !prev);
            }}
            className="date-trigger"
            aria-invalid={!!fieldErrors.endDate}
            aria-describedby={fieldErrors.endDate ? "project-end-date-error" : undefined}
          >
            {form.endDate || "Select end date"}
          </button>
          {fieldErrors.endDate && (
            <p id="project-end-date-error" className="text-sm text-red-600 mt-0.5" role="alert">
              {fieldErrors.endDate}
            </p>
          )}
          {endDateOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setEndDateOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-lg [&_.react-calendar]:text-xs [&_.react-calendar]:scale-90 [&_.react-calendar]:origin-top-left">
                <Calendar
                  value={form.endDate ? new Date(form.endDate) : null}
                  onChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      endDate: formatDateForCalendar(value)
                    }));
                    if (fieldErrors.endDate) setFieldErrors((prev) => ({ ...prev, endDate: "" }));
                    if (successMessage) setSuccessMessage("");
                    setEndDateOpen(false);
                  }}
                  className="rounded-lg border-0 overflow-hidden"
                />
              </div>
            </>
          )}
        </div>
        {successMessage && (
          <p className="text-sm text-green-600" role="status">
            {successMessage}
          </p>
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Create project
          </button>
          <button type="button" onClick={handleOpenModal} className="btn-secondary">
            View Projects
          </button>
        </div>
      </form>
      </div>

      <ProjectsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projects={projects}
        workers={workers}
        onAssign={handleAssign}
      />
    </div>
  );
}
