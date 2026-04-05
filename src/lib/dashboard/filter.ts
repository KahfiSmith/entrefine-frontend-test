import type { DashboardFilters, TransactionRecord } from "@/types/dashboard";

type SearchParamValue = string | string[] | undefined;

export type DashboardSearchParams = {
  channel?: SearchParamValue;
  status?: SearchParamValue;
  search?: SearchParamValue;
};

function readSearchParam(value: SearchParamValue): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export function parseDashboardFilters(
  searchParams: DashboardSearchParams | undefined
): DashboardFilters {
  const channel = readSearchParam(searchParams?.channel);
  const status = readSearchParam(searchParams?.status);
  const search = readSearchParam(searchParams?.search);

  return {
    channel: channel.length > 0 ? channel : "all",
    status: status.length > 0 ? status : "all",
    search,
    dateField: "payTime",
    dateFrom: null,
    dateTo: null,
  };
}

function matchesChannel(
  transaction: TransactionRecord,
  channel: DashboardFilters["channel"]
): boolean {
  if (channel === "all") {
    return true;
  }

  return transaction.channel === channel;
}

function matchesStatus(
  transaction: TransactionRecord,
  status: DashboardFilters["status"]
): boolean {
  if (status === "all") {
    return true;
  }

  return transaction.status === status;
}

function matchesSearch(
  transaction: TransactionRecord,
  search: DashboardFilters["search"]
): boolean {
  if (!search) {
    return true;
  }

  return transaction.orderId.toLowerCase().includes(search.toLowerCase());
}

export function filterTransactions(
  transactions: TransactionRecord[],
  filters: DashboardFilters
): TransactionRecord[] {
  return transactions.filter((transaction) => {
    return (
      matchesChannel(transaction, filters.channel) &&
      matchesStatus(transaction, filters.status) &&
      matchesSearch(transaction, filters.search)
    );
  });
}
