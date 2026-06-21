import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listContacts, markContactRead } from "@/services/contacts.service";
import { formatDate } from "@/utils/format";
import { useState } from "react";

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

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
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs"
                              onClick={() => setSelectedContact(row)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            {!row.isRead ? (
                              <button
                                type="button"
                                className="btn btn-xs"
                                onClick={() => handleMarkRead(row.id)}
                              >
                                Mark read
                              </button>
                            ) : null}
                          </div>
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

      <Modal
        open={Boolean(selectedContact)}
        title="Contact Message"
        onClose={() => setSelectedContact(null)}
        wide
      >
        {selectedContact ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-surface-muted)] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Name</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-brand-dark)]">{selectedContact.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Email</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-brand-dark)]">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Department</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-brand-dark)] capitalize">
                  {selectedContact.department ?? "General"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Received</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-brand-dark)]">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-brand-dark)]">
                {selectedContact.message}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              {!selectedContact.isRead ? (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={async () => {
                    await handleMarkRead(selectedContact.id);
                    setSelectedContact((prev) => (prev ? { ...prev, isRead: true } : prev));
                  }}
                >
                  Mark read
                </button>
              ) : null}
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSelectedContact(null)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
