export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          cpf: string | null
          phone: string | null
          birth_date: string | null
          avatar_url: string | null
          role: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          cpf?: string | null
          phone?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          cpf?: string | null
          phone?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type DatabasePublic = Database['public']
type Schema = DatabasePublic

export type TablesPublic<T extends keyof DatabasePublic['Tables']> = DatabasePublic['Tables'][T]
export type TablesInsertPublic<T extends keyof DatabasePublic['Tables']> = DatabasePublic['Tables'][T]['Insert']
export type TablesUpdatePublic<T extends keyof DatabasePublic['Tables']> = DatabasePublic['Tables'][T]['Update']

export const Constants = {
  public: {
    Enums: {},
  },
}
