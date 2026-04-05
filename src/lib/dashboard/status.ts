export type TransactionStatusTone =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "accent"
  | "neutral";

export function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTransactionStatusTone(
  status: string
): TransactionStatusTone {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    case "TO_RETURN":
      return "warning";
    case "PROCESSED":
      return "accent";
    case "SHIPPED":
      return "info";
    case "TO_CONFIRM_RECEIVE":
      return "neutral";
    default:
      return "neutral";
  }
}
