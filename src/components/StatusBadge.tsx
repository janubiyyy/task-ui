"use client";

type Props = { status: string };

export default function StatusBadge({ status }: Props) {
  const s = String(status).toUpperCase();

  const style =
    s === "DONE"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : s === "IN_PROGRESS"
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      : "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
  const label =
    s === "DONE" ? "DONE" : s === "IN_PROGRESS" ? "IN PROGRESS" : "TO DO";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
