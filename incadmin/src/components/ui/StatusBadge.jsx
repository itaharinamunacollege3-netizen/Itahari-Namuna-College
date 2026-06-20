import { STATUS_LABELS, STATUS_STYLES } from "@/constants/theme";
import { cn } from "@/utils/cn";

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
