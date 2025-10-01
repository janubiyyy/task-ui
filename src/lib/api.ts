// src/lib/api.ts
import { Task, TaskStatus } from "@/types/task";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// src/lib/api.ts
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }

  return res.json() as Promise<T>;
}

// Ambil semua task
export async function getTasks(params?: string) {
  const res = await fetch(`${BASE_URL}/tasks${params || ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Ambil task by id
export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Create task
export async function createTask(payload: {
  title: string;
  description?: string;
  status?: TaskStatus;
}): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Update task
export async function updateTask(id: string, data: Partial<Task>) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update: ${res.statusText}`);
  return res.json();
}

// Delete task
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}
