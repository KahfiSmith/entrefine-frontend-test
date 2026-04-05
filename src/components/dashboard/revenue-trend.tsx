type RevenueTrendItem = {
  dateLabel: string;
  revenue: string;
  transactions: string;
  width: string;
};

type RevenueTrendProps = {
  items: RevenueTrendItem[];
};

export function RevenueTrend({ items }: RevenueTrendProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Revenue trend</h2>
        <p className="text-sm text-muted-foreground">
          Daily revenue movement for the latest 7 days based on transaction payment dates.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.dateLabel} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{item.dateLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {item.transactions} transactions
                </p>
              </div>
              <p className="text-right font-medium">{item.revenue}</p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: item.width }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
