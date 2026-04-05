import Link from "next/link";

import { ChannelSummary } from "@/components/dashboard/channel-summary";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { RevenueTrend } from "@/components/dashboard/revenue-trend";
import { StatusSummary } from "@/components/dashboard/status-summary";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import {
  filterTransactions,
  parseDashboardFilters,
  type DashboardSearchParams,
} from "@/lib/dashboard/filter";
import {
  calculateDashboardMetrics,
  calculateRevenueTrend,
  getTransactionRevenue,
} from "@/lib/dashboard/metrics";
import { loadTransactions } from "@/lib/dashboard/load-transactions";
import {
  formatStatusLabel,
  getTransactionStatusTone,
} from "@/lib/dashboard/status";
import type {
  DashboardChannel,
  DashboardTransactionStatus,
  TransactionRecord,
} from "@/types/dashboard";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID");

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type ChannelSummary = {
  channel: DashboardChannel;
  revenue: number;
  transactions: number;
  share: number;
};

type StatusSummary = {
  status: DashboardTransactionStatus;
  count: number;
  revenue: number;
};

function parseTransactionDate(transaction: TransactionRecord): number {
  const candidate =
    transaction.payTime ?? transaction.createTime ?? transaction.syncedAt;

  if (!candidate) {
    return 0;
  }

  const timestamp = new Date(candidate).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatCount(value: number): string {
  return numberFormatter.format(value);
}

function formatTransactionDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function getChannelSummaries(
  transactions: TransactionRecord[],
): ChannelSummary[] {
  const totals = new Map<
    DashboardChannel,
    { revenue: number; transactions: number }
  >();
  let totalRevenue = 0;

  for (const transaction of transactions) {
    const revenue = getTransactionRevenue(transaction);
    const current = totals.get(transaction.channel) ?? {
      revenue: 0,
      transactions: 0,
    };

    current.revenue += revenue;
    current.transactions += 1;
    totalRevenue += revenue;

    totals.set(transaction.channel, current);
  }

  return Array.from(totals.entries())
    .map(([channel, summary]) => ({
      channel,
      revenue: summary.revenue,
      transactions: summary.transactions,
      share: totalRevenue > 0 ? summary.revenue / totalRevenue : 0,
    }))
    .toSorted((left, right) => right.revenue - left.revenue);
}

function getStatusSummaries(
  transactions: TransactionRecord[],
): StatusSummary[] {
  const totals = new Map<
    DashboardTransactionStatus,
    { count: number; revenue: number }
  >();

  for (const transaction of transactions) {
    const current = totals.get(transaction.status) ?? { count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += getTransactionRevenue(transaction);
    totals.set(transaction.status, current);
  }

  return Array.from(totals.entries())
    .map(([status, summary]) => ({
      status,
      count: summary.count,
      revenue: summary.revenue,
    }))
    .toSorted((left, right) => right.count - left.count);
}

function getRecentTransactions(
  transactions: TransactionRecord[],
): TransactionRecord[] {
  return transactions
    .toSorted(
      (left, right) => parseTransactionDate(right) - parseTransactionDate(left),
    )
    .slice(0, 12);
}

function getUniqueChannels(
  transactions: TransactionRecord[],
): DashboardChannel[] {
  return Array.from(
    new Set(transactions.map((transaction) => transaction.channel)),
  ).toSorted((left, right) => left.localeCompare(right));
}

function getUniqueStatuses(
  transactions: TransactionRecord[],
): DashboardTransactionStatus[] {
  return Array.from(
    new Set(transactions.map((transaction) => transaction.status)),
  ).toSorted((left, right) => left.localeCompare(right));
}

type HomePageProps = {
  searchParams?: Promise<DashboardSearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const allTransactions = await loadTransactions();
  const filters = parseDashboardFilters(await searchParams);
  const transactions = filterTransactions(allTransactions, filters);
  const metrics = calculateDashboardMetrics(transactions);
  const revenueTrend = calculateRevenueTrend(transactions);
  const channelSummaries = getChannelSummaries(transactions);
  const statusSummaries = getStatusSummaries(transactions);
  const recentTransactions = getRecentTransactions(transactions);
  const allChannels = getUniqueChannels(allTransactions);
  const allStatuses = getUniqueStatuses(allTransactions);
  const metricCardValues = {
    totalRevenue: formatCurrency(metrics.totalRevenue),
    totalTransactions: formatCount(metrics.totalTransactions),
    problematicTransactions: formatCount(metrics.problematicTransactions),
  };
  const channelSummaryItems = channelSummaries.map((summary) => ({
    channel: summary.channel,
    revenue: formatCurrency(summary.revenue),
    share: `${Math.round(summary.share * 100)}%`,
    transactions: formatCount(summary.transactions),
  }));
  const statusSummaryItems = statusSummaries.map((summary) => ({
    status: formatStatusLabel(summary.status),
    revenue: formatCurrency(summary.revenue),
    count: formatCount(summary.count),
    tone: getTransactionStatusTone(summary.status),
  }));
  const recentTransactionItems = recentTransactions.map((transaction) => ({
    amount: formatCurrency(getTransactionRevenue(transaction)),
    channel: transaction.channel,
    date: formatTransactionDate(transaction.payTime ?? transaction.createTime),
    orderId: transaction.orderId,
    status: formatStatusLabel(transaction.status),
    tone: getTransactionStatusTone(transaction.status),
  }));
  const peakTrendRevenue = Math.max(...revenueTrend.map((point) => point.revenue), 0);
  const revenueTrendItems = revenueTrend.map((point) => {
    const date = new Date(point.date);
    const dateLabel = Number.isNaN(date.getTime())
      ? point.date
      : dateFormatter.format(date);

    return {
      dateLabel,
      revenue: formatCurrency(point.revenue),
      transactions: formatCount(point.transactions),
      width: `${peakTrendRevenue > 0 ? Math.max((point.revenue / peakTrendRevenue) * 100, 8) : 0}%`,
    };
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-3 border-b pb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Finance dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Revenue and transaction overview
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            This view is designed to help finance and admin users quickly read
            business performance, transaction health, and channel contribution
            from CSV data.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <form className="grid gap-4 md:grid-cols-[1fr_220px_220px_auto] md:items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium">Search order ID</span>
              <input
                name="search"
                defaultValue={filters.search}
                placeholder="Example: ORDER-000123"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Channel</span>
              <select
                name="channel"
                defaultValue={filters.channel}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <option value="all">All channels</option>
                {allChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">Status</span>
              <select
                name="status"
                defaultValue={filters.status}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <option value="all">All statuses</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Apply
              </button>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition hover:bg-accent"
              >
                Reset
              </Link>
            </div>
          </form>
        </section>

        <MetricCards {...metricCardValues} />

        <section className="grid gap-6 xl:grid-cols-3">
          <RevenueTrend items={revenueTrendItems} />
          <ChannelSummary items={channelSummaryItems} />
          <StatusSummary items={statusSummaryItems} />
        </section>

        <TransactionsTable items={recentTransactionItems} />
      </div>
    </main>
  );
}
