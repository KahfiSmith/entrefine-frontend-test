type ChannelSummaryItem = {
  channel: string;
  revenue: string;
  share: string;
  transactions: string;
};

type ChannelSummaryProps = {
  items: ChannelSummaryItem[];
};

export function ChannelSummary({ items }: ChannelSummaryProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Channel performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Revenue and transaction comparison by channel.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article
            key={item.channel}
            className="rounded-xl border bg-background px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{item.channel}</p>
                <p className="text-sm text-muted-foreground">
                  {item.transactions} transactions
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.revenue}</p>
                <p className="text-sm text-muted-foreground">{item.share}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
