export interface Wallet {
  balance: number;
  created_at: number;
  updated_at: number;
}

export interface Provision {
  uid: string;
  id: string;
  amount: number;
  created_at: number;
  updated_at: number;
  status: string;
  banking_transaction_id: null;
  banking_transaction_time: null;
  banking_amount: number;
  banking_account: {
    no: string;
    name: string;
    bank_id: number;
    bank_name: string;
  };
  qr_url: string;
  banking_content: string;
}
