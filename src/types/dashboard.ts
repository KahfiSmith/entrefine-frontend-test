export const dashboardChannels = [
  "Shopee",
  "Tiktok Shop",
  "Tokopedia",
] as const;

export const dashboardTransactionStatuses = [
  "CANCELLED",
  "COMPLETED",
  "PROCESSED",
  "SHIPPED",
  "TO_CONFIRM_RECEIVE",
  "TO_RETURN",
] as const;

export const problematicTransactionStatuses = [
  "CANCELLED",
  "TO_RETURN",
] as const;

export type DashboardChannel =
  | (typeof dashboardChannels)[number]
  | (string & {});

export type DashboardTransactionStatus =
  | (typeof dashboardTransactionStatuses)[number]
  | (string & {});

export type ProblematicTransactionStatus =
  | (typeof problematicTransactionStatuses)[number]
  | (string & {});

export type DashboardDateField =
  | "payTime"
  | "createTime"
  | "shipByDate"
  | "syncedAt";

export interface CsvTransactionRow {
  order_id: string;
  channel: string;
  order_status: string;
  buyer_user_id: string;
  pay_time: string;
  create_time: string;
  ship_by_date: string;
  synced_at: string;
  gross_amount: string;
  net_amount: string;
  discount_amount: string;
  shipping_fee_amount: string;
  buyer_count: string;
  item_count: string;
}

export interface TransactionRecord {
  orderId: string;
  channel: DashboardChannel;
  status: DashboardTransactionStatus;
  buyerUserId: string;
  payTime: string | null;
  createTime: string | null;
  shipByDate: string | null;
  syncedAt: string | null;
  grossAmount: number;
  netAmount: number;
  discountAmount: number;
  shippingFeeAmount: number;
  buyerCount: number;
  itemCount: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalTransactions: number;
  problematicTransactions: number;
  problematicRevenue: number;
}

export interface DashboardFilters {
  channel: DashboardChannel | "all";
  status: DashboardTransactionStatus | "all";
  search: string;
  dateField: DashboardDateField;
  dateFrom: string | null;
  dateTo: string | null;
}

export interface RevenueTrendPoint {
  date: string;
  label: string;
  revenue: number;
  transactions: number;
}

export interface ChannelSummary {
  channel: DashboardChannel;
  revenue: number;
  transactions: number;
  revenueShare: number;
  problematicTransactions: number;
}

export interface StatusSummary {
  status: DashboardTransactionStatus;
  count: number;
  percentage: number;
  revenue: number;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
  tone: "neutral" | "positive" | "warning";
}

export interface DashboardSnapshot {
  metrics: DashboardMetrics;
  revenueTrend: RevenueTrendPoint[];
  channelSummaries: ChannelSummary[];
  statusSummaries: StatusSummary[];
  transactions: TransactionRecord[];
  insights: DashboardInsight[];
}
