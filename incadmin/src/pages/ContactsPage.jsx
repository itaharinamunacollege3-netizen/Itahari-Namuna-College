import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmpty,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";
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

      <Card className="p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <DataTable>
              <DataTableHead>
                <DataTableRow className="text-xs uppercase text-slate-500">
                  <DataTableHeaderCell>Name</DataTableHeaderCell>
                  <DataTableHeaderCell>Department</DataTableHeaderCell>
                  <DataTableHeaderCell>Message</DataTableHeaderCell>
                  <DataTableHeaderCell>Date</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell />
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {data?.length ? (
                  data.map((row) => (
                    <DataTableRow key={row.id}>
                      <DataTableCell>
                          <p className="font-medium">{row.fullName}</p>
                          <p className="text-xs text-slate-500">{row.email}</p>
                      </DataTableCell>
                      <DataTableCell className="capitalize">{row.department}</DataTableCell>
                      <DataTableCell className="max-w-xs truncate">{row.message}</DataTableCell>
                      <DataTableCell>{formatDate(row.createdAt)}</DataTableCell>
                      <DataTableCell>
                          {row.isRead ? (
                            <span className="badge badge-ghost">Read</span>
                          ) : (
                            <span className="badge badge-warning">Unread</span>
                          )}
                      </DataTableCell>
                      <DataTableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => setSelectedContact(row)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            {!row.isRead ? (
                              <Button
                                size="xs"
                                variant="neutral"
                                onClick={() => handleMarkRead(row.id)}
                              >
                                Mark read
                              </Button>
                            ) : null}
                          </div>
                      </DataTableCell>
                    </DataTableRow>
                    ))
                ) : (
                  <DataTableEmpty colSpan={6} className="text-slate-500">
                    No contacts yet
                  </DataTableEmpty>
                )}
              </DataTableBody>
            </DataTable>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </Card>

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
                <Button
                  size="sm"
                  onClick={async () => {
                    await handleMarkRead(selectedContact.id);
                    setSelectedContact((prev) => (prev ? { ...prev, isRead: true } : prev));
                  }}
                >
                  Mark read
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={() => setSelectedContact(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
