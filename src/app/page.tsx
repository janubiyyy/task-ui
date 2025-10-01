"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { http, deleteTask } from "@/lib/api";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  updatedAt: string;
};

type Paginated = {
  data: Task[];
  total: number;
  page: number;
  limit: number;
};

const STATUS_FILTER = ["All", "TO_DO", "IN_PROGRESS", "DONE"] as const;

export default function HomePage() {
  const [status, setStatus] = useState<(typeof STATUS_FILTER)[number]>("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // tampilkan 5 per halaman
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // modal delete
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const q = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status !== "All") p.set("status", status);
    return `/tasks?${p.toString()}`;
  }, [status, page, limit]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const res = await http<Paginated>(q);
      setRows(res.data ?? []);
      setTotal(res.total ?? 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask(selectedTask.id);
      toast.success("✅ Task deleted successfully");
      setIsOpen(false);
      fetchData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error("❌ Gagal hapus: " + e.message);
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-700 flex items-center gap-2">
          📋 Task Manager
        </h1>
        <Link
          href="/tasks/create"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 text-white shadow hover:from-sky-600 hover:to-blue-700 transition-all"
        >
          ➕ Add Task
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">
          Filter Status
        </label>
        <select
          value={status}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStatus(e.target.value as any);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-200"
        >
          {STATUS_FILTER.map((s) => (
            <option key={s} value={s}>
              {s === "All"
                ? "All"
                : s === "TO_DO"
                ? "TO DO"
                : s === "IN_PROGRESS"
                ? "IN PROGRESS"
                : "DONE"}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-sky-100 text-left text-sky-700">
              <tr>
                <th className="px-4 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Belum ada task.
                  </td>
                </tr>
              ) : (
                rows.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    {/* Nomor urut */}
                    <td className="px-4 py-3 text-gray-600">
                      {(page - 1) * limit + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t.title}</div>
                      {t.description && (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {t.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(t.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tasks/${t.id}/edit`}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedTask(t);
                            setIsOpen(true);
                          }}
                          className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <span>
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded-md px-3 py-1.5 ${
                  page === i + 1
                    ? "bg-sky-600 text-white shadow"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus task{" "}
              <span className="font-semibold text-red-600">
                {selectedTask?.title}
              </span>
              ?
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  );
}
