export function Pagination({ meta, onPageChange }) {
  if (!meta?.totalPages || meta.totalPages <= 1) return null;

  const page = meta.page ?? 1;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
      <span>
        Page {page} of {meta.totalPages} ({meta.total} total)
      </span>
      <div className="join">
        <button
          type="button"
          className="btn btn-sm join-item"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-sm join-item"
          disabled={page >= meta.totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
