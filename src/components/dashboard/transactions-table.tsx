import type { TransactionStatusTone } from "@/lib/dashboard/status";

type TransactionTableItem = {
  amount: string;
  channel: string;
  date: string;
  orderId: string;
  status: string;
  tone: TransactionStatusTone;
};

type TransactionsTableProps = {
  items: TransactionTableItem[];
};

function getStatusBadgeClasses(tone: TransactionStatusTone): string {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "info":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "accent":
      return "border-violet-200 bg-violet-50 text-violet-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

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
                        getStatusBadgeClasses(item.tone),
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
