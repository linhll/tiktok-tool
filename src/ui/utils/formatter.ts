import { Period } from "@ui/models/subscription";

export const toCurrency = (num: number) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export const fromCurrency = (cur: string) => {
  cur = cur.replace(/[^0-9\.\,]/g, "");
  cur = cur.replace(/\./g, "");
  cur = cur.replace(/\,/g, ".");
  return +cur;
};

export const formatPeriod = (period: Period) => {
  const num = +period.substring(0, period.length - 1);
  const unit = period.substr(-1);

  if (unit === "M") {
    if (num === 1) {
      return "tháng";
    }
    return `${num} tháng`;
  }
  if (unit === "Y") {
    if (num === 1) {
      return "năm";
    }
    return `${num} năm`;
  }
  return period;
};

export const formatDateDDMMYYYY = (timestamp: Date | number) => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;

  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();

  return `${d}/${m}/${y}`;
};
