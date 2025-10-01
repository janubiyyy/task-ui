"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Loader2, Save } from "lucide-react";

interface TaskFormProps {
  initial?: Partial<Task>;
  showStatus?: boolean;
  submitting?: boolean;
  onSubmit: (payload: {
    title: string;
    description?: string;
    status?: TaskStatus;
  }) => Promise<void>;
}

export default function TaskForm({
  initial,
  showStatus = false,
  submitting = false,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initial?.status || "TO_DO");

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ title, description, status });
      }}
    >
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 w-full rounded border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {showStatus && (
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`
    w-full inline-flex items-center justify-center gap-2
    rounded-lg px-5 py-3 font-medium shadow-md
    transition-all duration-200 ease-in-out
    ${
      submitting
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
    }
  `}
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save
          </>
        )}
      </button>
    </form>
  );
}
