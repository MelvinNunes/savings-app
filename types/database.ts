export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      savings_challenges: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          type: string;
          base_amount: number;
          currency_code: string;
          start_date: string;
          progress: Json;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          type: string;
          base_amount: number;
          currency_code: string;
          start_date: string;
          progress: Json;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          type?: string;
          base_amount?: number;
          currency_code?: string;
          start_date?: string;
          progress?: Json;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
