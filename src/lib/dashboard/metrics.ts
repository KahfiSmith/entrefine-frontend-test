import {
  problematicTransactionStatuses,
  type DashboardMetrics,
  type RevenueTrendPoint,
  type TransactionRecord,
} from "@/types/dashboard";

const problematicStatusSet = new Set<string>(problematicTransactionStatuses);

export function isProblematicTransaction(
  transaction: TransactionRecord
): boolean {
  return problematicStatusSet.has(transaction.status);
}

export function getTransactionRevenue(transaction: TransactionRecord): number {
  return transaction.netAmount;
}

export function createEmptyDashboardMetrics(): DashboardMetrics {
  return {
    totalRevenue: 0,
    totalTransactions: 0,
    problematicTransactions: 0,
    problematicRevenue: 0,
  };
}

export function calculateDashboardMetrics(
  transactions: TransactionRecord[]
): DashboardMetrics {
  if (transactions.length === 0) {
    return createEmptyDashboardMetrics();
  }

  let totalRevenue = 0;
  let problematicTransactions = 0;
  let problematicRevenue = 0;

  for (const transaction of transactions) {
    const revenue = getTransactionRevenue(transaction);
    totalRevenue += revenue;

    if (isProblematicTransaction(transaction)) {
      problematicTransactions += 1;
      problematicRevenue += revenue;
    }
  }

  return {
    totalRevenue,
    totalTransactions: transactions.length,
    problematicTransactions,
    problematicRevenue,
  };
}

function getTransactionTrendDate(transaction: TransactionRecord): string | null {
  const candidate =
    transaction.payTime ?? transaction.createTime ?? transaction.syncedAt;

  if (!candidate) {
    return null;
  }

  const normalizedCandidate = candidate.trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(normalizedCandidate)) {
    return normalizedCandidate.slice(0, 10);
  }

  const parsedDate = new Date(normalizedCandidate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10);
}

function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function formatIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function calculateRevenueTrend(
  transactions: TransactionRecord[],
  limit = 7
): RevenueTrendPoint[] {
  const groupedByDate = new Map<string, RevenueTrendPoint>();
  let latestDate: string | null = null;

  for (const transaction of transactions) {
    const date = getTransactionTrendDate(transaction);

    if (!date) {
      continue;
    }

    const current = groupedByDate.get(date) ?? {
      date,
      label: date,
      revenue: 0,
      transactions: 0,
    };

    current.revenue += getTransactionRevenue(transaction);
    current.transactions += 1;

    groupedByDate.set(date, current);

    if (!latestDate || date > latestDate) {
      latestDate = date;
    }
  }

  if (!latestDate) {
    return [];
  }

  const endDate = parseIsoDate(latestDate);
  const trend: RevenueTrendPoint[] = [];

  for (let offset = limit - 1; offset >= 0; offset -= 1) {
    const currentDate = new Date(endDate);
    currentDate.setUTCDate(endDate.getUTCDate() - offset);

    const date = formatIsoDate(currentDate);
    const current = groupedByDate.get(date);

    trend.push(
      current ?? {
        date,
        label: date,
        revenue: 0,
        transactions: 0,
      }
    );
  }

  return trend;
}
