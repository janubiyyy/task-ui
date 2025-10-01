"use client";

import TaskForm from "@/components/TaskForm";
import { getTask, updateTask } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-600">
        ⏳ Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-red-50 p-6 text-center text-red-700 shadow">
        ⚠️ Error: {String(error)}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-yellow-50 p-6 text-center text-yellow-700 shadow">
        🚫 Task not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-200"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md ">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          ✏️ Edit Task
        </h2>
        <hr className="mb-5" />
        <TaskForm
          initial={data}
          showStatus
          submitting={submitting}
          onSubmit={async (payload) => {
            try {
              setSubmitting(true);
              await updateTask(id, payload);

              toast.success(" Task updated successfully!");
              router.push("/");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              toast.error(` Failed: ${e.message || "Unknown error"}`);
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </div>
    </main>
  );
}
