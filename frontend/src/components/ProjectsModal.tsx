import type { Project, Worker } from "../types";
import ProjectsList from "./ProjectsList";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  workers: Worker[];
  onAssign: (projectId: number, workerId: number) => void;
}

export default function ProjectsModal({ isOpen, onClose, projects, workers, onAssign }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
            Projects
          </h2>
          <button type="button" onClick={onClose} className="btn-modal-close">
            Close
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <ProjectsList projects={projects} workers={workers} onAssign={onAssign} />
        </div>
      </div>
    </div>
  );
}
