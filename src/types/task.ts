export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string | number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface PaginatedTasks {
  data: Task[];
  meta?: PaginatedMeta;
}
