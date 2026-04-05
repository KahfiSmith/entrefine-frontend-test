type TransactionTableItem = {
  amount: string;
  channel: string;
  date: string;
  isProblematic: boolean;
  orderId: string;
  status: string;
};

type TransactionsTableProps = {
  items: TransactionTableItem[];
};

export function TransactionsTable({ items }: TransactionsTableProps) {
  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent transactions
        </h2>
        <p className="text-sm text-muted-foreground">
          A quick sample of the latest transactions to review operational
          conditions without opening the full raw dataset.
        </p>
      </div>

      <div className="overflow-x-auto">
        {items.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Channel</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.orderId} className="border-t">
                  <td className="px-6 py-4 text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 font-medium">{item.orderId}</td>
                  <td className="px-6 py-4">{item.channel}</td>
                  <td className="px-6 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                        item.isProblematic
                          ? "border-destructive/20 bg-destructive/10 text-destructive"
                          : "border-primary/10 bg-primary/10 text-primary",
                      ].join(" ")}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-sm text-muted-foreground">
            No transactions match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}
