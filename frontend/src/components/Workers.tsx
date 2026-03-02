import { useEffect, useState, type SubmitEventHandler } from "react";
import type { Worker } from "../types";
import { getWorkers, createWorker } from "../api/api";

const ROLE_OPTIONS = ["Frontend", "Backend", "ML", "UX/UI"] as const;
const SENIORITY_OPTIONS = ["Junior", "Semi-senior", "Senior"] as const;

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name: string; role: string; seniority: string }>({
    name: "",
    role: "",
    seniority: ""
  });
  const [form, setForm] = useState({
    name: "",
    role: "",
    seniority: ""
  });

  const loadWorkers = async () => {
    const data = await getWorkers();
    setWorkers(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadWorkers();
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const nameError = !form.name.trim() ? "Required" : "";
    const roleError = !form.role ? "Required" : "";
    const seniorityError = !form.seniority ? "Required" : "";
    setFieldErrors({ name: nameError, role: roleError, seniority: seniorityError });
    if (nameError || roleError || seniorityError) return;
    await createWorker(form);
    setForm({ name: "", role: "", seniority: "" });
    setFieldErrors({ name: "", role: "", seniority: "" });
    setSuccessMessage("Worker added successfully.");
    loadWorkers();
  };

  useEffect(() => {
    if (!successMessage) return;
    const id = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(id);
  }, [successMessage]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Add a worker here</h2>

      <div className="flex gap-12 items-start">
        <div className="flex-1 min-w-0 max-w-xs">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="worker-name" className="block text-xs font-medium text-slate-700 mb-0.5">
                Name
              </label>
              <input
                id="worker-name"
                placeholder="Name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                  if (successMessage) setSuccessMessage("");
                }}
                className="input-field"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "worker-name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="worker-name-error" className="text-sm text-red-600 mt-0.5" role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="worker-role" className="block text-xs font-medium text-slate-700 mb-0.5">
                Role
              </label>
              <select
                id="worker-role"
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value });
                  if (fieldErrors.role) setFieldErrors((prev) => ({ ...prev, role: "" }));
                  if (successMessage) setSuccessMessage("");
                }}
                className="select-field"
                aria-invalid={!!fieldErrors.role}
                aria-describedby={fieldErrors.role ? "worker-role-error" : undefined}
              >
                <option value="">Select role</option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.role && (
                <p id="worker-role-error" className="text-sm text-red-600 mt-0.5" role="alert">
                  {fieldErrors.role}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="worker-seniority" className="block text-xs font-medium text-slate-700 mb-0.5">
                Seniority
              </label>
              <select
                id="worker-seniority"
                value={form.seniority}
                onChange={(e) => {
                  setForm({ ...form, seniority: e.target.value });
                  if (fieldErrors.seniority) setFieldErrors((prev) => ({ ...prev, seniority: "" }));
                  if (successMessage) setSuccessMessage("");
                }}
                className="select-field"
                aria-invalid={!!fieldErrors.seniority}
                aria-describedby={fieldErrors.seniority ? "worker-seniority-error" : undefined}
              >
                <option value="">Select seniority</option>
                {SENIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.seniority && (
                <p id="worker-seniority-error" className="text-sm text-red-600 mt-0.5" role="alert">
                  {fieldErrors.seniority}
                </p>
              )}
            </div>
            {successMessage && (
              <p className="text-sm text-green-600" role="status">
                {successMessage}
              </p>
            )}
            <button type="submit" className="btn-primary">
              Add worker
            </button>
          </form>
        </div>

        <div className="w-64 shrink-0 flex flex-col border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
          <p className="text-xs font-medium text-slate-700 px-2 py-1.5 border-b border-slate-200 bg-white">
            Workers
          </p>
          <ul className="flex-1 overflow-y-auto p-1.5 space-y-1 min-h-0 max-h-52">
            {workers.length === 0 ? (
              <li className="text-xs text-slate-500 py-1.5 px-2">No workers yet</li>
            ) : (
              workers.map((w) => (
                <li
                  key={w.id}
                  className="text-xs py-1.5 px-2 rounded bg-white border border-slate-200 text-slate-800"
                >
                  {w.name} – {w.role} ({w.seniority})
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
