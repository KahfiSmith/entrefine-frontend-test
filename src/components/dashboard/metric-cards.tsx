import {
  AlertTriangle,
  CircleDollarSign,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

type MetricCardsProps = {
  averageOrderValue: string;
  problematicTransactions: string;
  totalRevenue: string;
  totalTransactions: string;
};

type MetricCardProps = {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warning";
  value: string;
};

function MetricCard({
  description,
  icon: Icon,
  tone = "default",
  value,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <span
          className={[
            "inline-flex size-11 items-center justify-center rounded-full border",
            tone === "warning"
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : "border-primary/10 bg-primary/10 text-primary",
          ].join(" ")}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </article>
  );
}

export function MetricCards({
  averageOrderValue,
  problematicTransactions,
  totalRevenue,
  totalTransactions,
}: MetricCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        description="Total revenue"
        icon={CircleDollarSign}
        value={totalRevenue}
      />
      <MetricCard
        description="Total transactions"
        icon={ReceiptText}
        value={totalTransactions}
      />
      <MetricCard
        description="Average order value"
        icon={TrendingUp}
        value={averageOrderValue}
      />
      <MetricCard
        description="Problematic transactions"
        icon={AlertTriangle}
        tone="warning"
        value={problematicTransactions}
      />
    </section>
  );
}
