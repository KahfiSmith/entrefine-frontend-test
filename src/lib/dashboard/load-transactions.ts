import { readFile } from "node:fs/promises";
import path from "node:path";

import type { CsvTransactionRow, TransactionRecord } from "@/types/dashboard";

const transactionCsvHeaders: Array<keyof CsvTransactionRow> = [
  "order_id",
  "channel",
  "order_status",
  "buyer_user_id",
  "pay_time",
  "create_time",
  "ship_by_date",
  "synced_at",
  "gross_amount",
  "net_amount",
  "discount_amount",
  "shipping_fee_amount",
  "buyer_count",
  "item_count",
];

const transactionsCsvFilePath = path.join(
  process.cwd(),
  "data",
  "transactions.csv"
);

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];

      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
        continue;
      }

      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);

  return values.map((value) => value.trim());
}

function assertValidHeaders(headers: string[]): asserts headers is Array<keyof CsvTransactionRow> {
  const missingHeaders = transactionCsvHeaders.filter(
    (header) => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new Error(
      `transactions.csv is missing required headers: ${missingHeaders.join(", ")}`
    );
  }
}

function parseCsvRows(content: string): CsvTransactionRow[] {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  assertValidHeaders(headers);

  return lines.slice(1).map((line, rowIndex) => {
    const values = splitCsvLine(line);

    if (values.length !== headers.length) {
      throw new Error(
        `transactions.csv row ${rowIndex + 2} has ${values.length} columns; expected ${headers.length}.`
      );
    }

    return headers.reduce<CsvTransactionRow>((row, header, headerIndex) => {
      row[header] = values[headerIndex] ?? "";
      return row;
    }, {} as CsvTransactionRow);
  });
}

function parseRequiredNumber(value: string, fieldName: keyof CsvTransactionRow, orderId: string): number {
  const normalizedValue = value.trim();
  const parsedValue = Number(normalizedValue);

  if (!normalizedValue || Number.isNaN(parsedValue)) {
    throw new Error(
      `Invalid numeric value for "${fieldName}" in order "${orderId}".`
    );
  }

  return parsedValue;
}

function parseOptionalDate(value: string): string | null {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeTransactionRow(row: CsvTransactionRow): TransactionRecord {
  return {
    orderId: row.order_id.trim(),
    channel: row.channel.trim(),
    status: row.order_status.trim(),
    buyerUserId: row.buyer_user_id.trim(),
    payTime: parseOptionalDate(row.pay_time),
    createTime: parseOptionalDate(row.create_time),
    shipByDate: parseOptionalDate(row.ship_by_date),
    syncedAt: parseOptionalDate(row.synced_at),
    grossAmount: parseRequiredNumber(row.gross_amount, "gross_amount", row.order_id),
    netAmount: parseRequiredNumber(row.net_amount, "net_amount", row.order_id),
    discountAmount: parseRequiredNumber(
      row.discount_amount,
      "discount_amount",
      row.order_id
    ),
    shippingFeeAmount: parseRequiredNumber(
      row.shipping_fee_amount,
      "shipping_fee_amount",
      row.order_id
    ),
    buyerCount: parseRequiredNumber(row.buyer_count, "buyer_count", row.order_id),
    itemCount: parseRequiredNumber(row.item_count, "item_count", row.order_id),
  };
}

export async function loadTransactionRows(): Promise<CsvTransactionRow[]> {
  const fileContent = await readFile(transactionsCsvFilePath, "utf8");
  return parseCsvRows(fileContent);
}

export async function loadTransactions(): Promise<TransactionRecord[]> {
  const rows = await loadTransactionRows();
  return rows.map(normalizeTransactionRow);
}

export { transactionsCsvFilePath };
