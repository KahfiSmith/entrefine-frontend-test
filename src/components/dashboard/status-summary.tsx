import type { TransactionStatusTone } from "@/lib/dashboard/status";

type StatusSummaryItem = {
  count: string;
  revenue: string;
  status: string;
  tone: TransactionStatusTone;
};

type StatusSummaryProps = {
  items: StatusSummaryItem[];
};

function getStatusSurfaceClasses(tone: TransactionStatusTone): string {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50/60";
    case "danger":
      return "border-rose-200 bg-rose-50/70";
    case "warning":
      return "border-amber-200 bg-amber-50/70";
    case "info":
      return "border-sky-200 bg-sky-50/70";
    case "accent":
      return "border-violet-200 bg-violet-50/70";
    default:
      return "border-slate-200 bg-slate-50/70";
  }
}

function getStatusDotClasses(tone: TransactionStatusTone): string {
  switch (tone) {
    case "success":
      return "bg-emerald-500";
    case "danger":
      return "bg-rose-500";
    case "warning":
      return "bg-amber-500";
    case "info":
      return "bg-sky-500";
    case "accent":
      return "bg-violet-500";
    default:
      return "bg-slate-500";
  }
}

export function StatusSummary({ items }: StatusSummaryProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Transaction status
        </h2>
        <p className="text-sm text-muted-foreground">
          Status distribution to detect operational issues earlier.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article
            key={item.status}
            className={[
              "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3",
              getStatusSurfaceClasses(item.tone),
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span
                className={[
                  "inline-flex size-2.5 rounded-full",
                  getStatusDotClasses(item.tone),
                ].join(" ")}
              />
              <div>
                <p className="font-medium">{item.status}</p>
                <p className="text-sm text-muted-foreground">{item.revenue}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{item.count}</p>
              <p className="text-xs text-muted-foreground">transactions</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
