"use client";

import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function CreateTaskPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

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
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          ➕ Create Task
        </h2>
        <hr className="mb-5" />
        <TaskForm
          submitting={submitting}
          onSubmit={async (payload) => {
            try {
              setSubmitting(true);
              await createTask({
                title: payload.title,
                description: payload.description,
              });
              toast.success(" Task created successfully!");
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
