import toast from "react-hot-toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listContacts, markContactRead } from "@/services/contacts.service";
import { formatDate } from "@/utils/format";
import { useState } from "react";

export default function ContactsPage() {
  const [page, setPage] = useState(1);

  const { data, meta, loading, error, reload } = useAsyncData(
    () => listContacts(page, 20),
    [page]
  );

  async function handleMarkRead(id) {
    try {
      await markContactRead(id);
      toast.success("Marked as read");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div>
      <PageHeader title="Contacts" subtitle="Incoming contact form messages" />

      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-xs uppercase text-slate-500">
                    <th>Name</th>
                    <th>Department</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data?.length ? (
                    data.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <p className="font-medium">{row.fullName}</p>
                          <p className="text-xs text-slate-500">{row.email}</p>
                        </td>
                        <td className="capitalize">{row.department}</td>
                        <td className="max-w-xs truncate">{row.message}</td>
                        <td>{formatDate(row.createdAt)}</td>
                        <td>
                          {row.isRead ? (
                            <span className="badge badge-ghost">Read</span>
                          ) : (
                            <span className="badge badge-warning">Unread</span>
                          )}
                        </td>
                        <td>
                          {!row.isRead ? (
                            <button
                              type="button"
                              className="btn btn-xs"
                              onClick={() => handleMarkRead(row.id)}
                            >
                              Mark read
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        No contacts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
