CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_workers (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_project_workers_project 
ON project_workers(project_id);

CREATE INDEX IF NOT EXISTS idx_project_workers_worker 
ON project_workers(worker_id);