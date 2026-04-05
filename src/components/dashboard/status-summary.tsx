type StatusSummaryItem = {
  count: string;
  revenue: string;
  status: string;
};

type StatusSummaryProps = {
  items: StatusSummaryItem[];
};

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
            className="flex items-center justify-between gap-4 rounded-2xl border bg-background px-4 py-3"
          >
            <div>
              <p className="font-medium">{item.status}</p>
              <p className="text-sm text-muted-foreground">{item.revenue}</p>
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
