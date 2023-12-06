export enum Period {
  Monthly = "1M",
  Yearly = "1Y",
}

export interface SubscriptionPlan {
  enabled: boolean;
  vip: boolean;
  price: number;
  period: Period;
  title: string;
  description: string;
  level: number;
  id: string;
  created_at: number;
  updated_at: number;
  benefits: string[];
}

export interface UserSubscription {
  plan_id: string;
  uid: string;
  auto_renew: boolean;
  cancelled: boolean;
  valid_to: number;
  valid_from: number;
  total_day_count: number;
  transaction_id: string | null;
  refund_transaction_id: string | null;
  id: string;
  created_at?: number;
  updated_at?: number;
}
