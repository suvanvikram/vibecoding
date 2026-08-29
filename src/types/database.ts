export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
        };
        Update: {
          display_name?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'expense' | 'income' | 'transfer' | 'investment';
          merchant: string;
          category: string;
          date: string;
          payment_method: string;
          amount: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          type: 'expense' | 'income' | 'transfer' | 'investment';
          merchant: string;
          category: string;
          date: string;
          payment_method: string;
          amount: number;
          notes?: string | null;
        };
        Update: {
          type?: 'expense' | 'income' | 'transfer' | 'investment';
          merchant?: string;
          category?: string;
          date?: string;
          payment_method?: string;
          amount?: number;
          notes?: string | null;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          limit_amount: number;
          period: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category: string;
          limit_amount: number;
          period?: string;
        };
        Update: {
          category?: string;
          limit_amount?: number;
          period?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          color?: string;
        };
        Update: {
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          color?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'Equity' | 'Mutual Funds' | 'Gold' | 'Fixed Deposits' | 'Bonds' | 'Crypto' | 'Other';
          invested_amount: number;
          current_value: number;
          purchase_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          type: 'Equity' | 'Mutual Funds' | 'Gold' | 'Fixed Deposits' | 'Bonds' | 'Crypto' | 'Other';
          invested_amount: number;
          current_value: number;
          purchase_date: string;
          notes?: string | null;
        };
        Update: {
          name?: string;
          type?: 'Equity' | 'Mutual Funds' | 'Gold' | 'Fixed Deposits' | 'Bonds' | 'Crypto' | 'Other';
          invested_amount?: number;
          current_value?: number;
          purchase_date?: string;
          notes?: string | null;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'Cash' | 'Bank accounts' | 'Investments' | 'Property' | 'Other';
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          type: 'Cash' | 'Bank accounts' | 'Investments' | 'Property' | 'Other';
          value: number;
        };
        Update: {
          name?: string;
          type?: 'Cash' | 'Bank accounts' | 'Investments' | 'Property' | 'Other';
          value?: number;
        };
      };
      liabilities: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'Loans' | 'Credit cards' | 'Other';
          value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          type: 'Loans' | 'Credit cards' | 'Other';
          value: number;
        };
        Update: {
          name?: string;
          type?: 'Loans' | 'Credit cards' | 'Other';
          value?: number;
        };
      };
      income_sources: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          frequency: 'monthly' | 'yearly';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          amount: number;
          frequency?: 'monthly' | 'yearly';
        };
        Update: {
          name?: string;
          amount?: number;
          frequency?: 'monthly' | 'yearly';
        };
      };
    };
  };
}
