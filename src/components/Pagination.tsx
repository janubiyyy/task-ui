"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
}: {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const go = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    params.set("limit", String(limit));
    router.replace(`/?${params.toString()}`);
    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasPrev = page > 1;
  const hasNext = totalPages ? page < totalPages : true; // kalau meta tidak ada, izinkan Next sampai server kosongkan data

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => hasPrev && go(page - 1)}
        className="px-3 py-1.5 rounded border disabled:opacity-40"
        disabled={!hasPrev}
      >
        Previous
      </button>

      <div className="text-sm text-gray-600">
        Page <b>{page}</b>
        {totalPages ? (
          <>
            {" "}
            of <b>{totalPages}</b>
          </>
        ) : null}
        {typeof total === "number" ? (
          <>
            {" "}
            • Total <b>{total}</b>
          </>
        ) : null}
      </div>

      <button
        onClick={() => hasNext && go(page + 1)}
        className="px-3 py-1.5 rounded border disabled:opacity-40"
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
}
