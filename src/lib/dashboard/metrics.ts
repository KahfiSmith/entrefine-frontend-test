import {
  problematicTransactionStatuses,
  type DashboardMetrics,
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
    averageOrderValue: 0,
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
    averageOrderValue: totalRevenue / transactions.length,
    problematicTransactions,
    problematicRevenue,
  };
}
