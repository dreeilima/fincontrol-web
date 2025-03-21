export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  created_at: string;
  color: string | null;
  icon: string | null;
  is_default: boolean;
  updated_at: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  categoryId: string;
  date: string;
  user_id?: string;
  created_at?: string;
  bankAccountId?: string | null;
  accountId?: string | null;
  updated_at?: string;
}
