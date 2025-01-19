export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          description: string;
          photo_url: string;
          latitude: number;
          longitude: number;
          address: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          photo_url: string;
          latitude: number;
          longitude: number;
          address: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          photo_url?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
  };
}