export interface Worker {
    id: number;
    name: string;
    role: string;
    seniority: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    workers: Worker[];
  }