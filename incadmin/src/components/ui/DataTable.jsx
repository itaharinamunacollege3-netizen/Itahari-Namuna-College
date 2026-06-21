import { cn } from "@/utils/cn";

export function DataTable({ children, className, tableClassName = "table", ...props }) {
  return (
    <div className={cn("overflow-x-auto", className)} {...props}>
      <table className={tableClassName}>{children}</table>
    </div>
  );
}

export function DataTableHead({ children, className, ...props }) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function DataTableBody({ children, className, ...props }) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function DataTableRow({ children, className, ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function DataTableHeaderCell({ children, className, ...props }) {
  return (
    <th className={className} {...props}>
      {children}
    </th>
  );
}

export function DataTableCell({ children, className, ...props }) {
  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
}

export function DataTableEmpty({ colSpan, children, className }) {
  return (
    <DataTableRow>
      <DataTableCell colSpan={colSpan} className={cn("py-10 text-center text-[var(--text-muted)]", className)}>
        {children}
      </DataTableCell>
    </DataTableRow>
  );
}
