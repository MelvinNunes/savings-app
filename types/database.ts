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
      savings_progress: {
        Row: {
          id: string;
          user_id: string;
          base_amount: number;
          progress: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          base_amount: number;
          progress: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          base_amount?: number;
          progress?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
