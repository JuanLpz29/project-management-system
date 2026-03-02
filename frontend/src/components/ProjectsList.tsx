import type { Project, Worker } from "../types";

interface Props {
  projects: Project[];
  workers?: Worker[];
  onAssign?: (projectId: number, workerId: number) => void;
}

export default function ProjectsList({ projects, workers = [], onAssign }: Props) {
  const showAssign = workers.length > 0 && onAssign;

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white shadow-md rounded-xl p-4 space-y-2 border border-slate-200"
        >
          <h3 className="text-base font-semibold text-slate-800">
            {project.name}
          </h3>
          <p className="text-xs text-slate-600">Client: {project.client}</p>
          <p className="text-xs text-slate-600">
            {project.startDate} – {project.endDate}
          </p>
          <div className="pt-2 h-20 flex flex-col min-h-0">
            <p className="text-xs font-medium text-slate-700 shrink-0">Workers:</p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 overflow-y-auto flex-1 min-h-0 mt-0.5 pr-1">
              {project.workers.length === 0 ? (
                <li>No workers assigned</li>
              ) : (
                project.workers.map((w) => (
                  <li key={w.id}>
                    {w.name} – {w.role} ({w.seniority})
                  </li>
                ))
              )}
            </ul>
          </div>
          {showAssign && (
            <div className="pt-2">
              <label htmlFor={`assign-${project.id}`} className="sr-only">
                Assign worker
              </label>
              <select
                id={`assign-${project.id}`}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id) onAssign(project.id, id);
                  e.target.value = "";
                }}
                className="select-field"
              >
                <option value="">Assign worker</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
