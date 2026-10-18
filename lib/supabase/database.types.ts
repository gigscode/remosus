export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      career_profiles: Table<
        {
          id: string
          user_id: string
          doc_type: 'master-cv' | 'content-writer' | 'wordpress'
          content: string
          updated_at: string
        },
        {
          id?: string
          user_id: string
          doc_type: 'master-cv' | 'content-writer' | 'wordpress'
          content?: string
          updated_at?: string
        }
      >
      profiles: Table<
        { id: string; full_name: string | null; role: string | null; portfolio_url: string | null; skills: string[]; created_at: string },
        { id: string; full_name?: string | null; role?: string | null; portfolio_url?: string | null; skills?: string[]; created_at?: string }
      >
      campaigns: Table<
        { id: string; user_id: string; name: string; source_url: string | null; status: string; created_at: string },
        { id?: string; user_id: string; name: string; source_url?: string | null; status?: string; created_at?: string }
      >
      opportunities: Table<
        {
          id: string
          user_id: string
          campaign_id: string | null
          company_name: string
          title: string
          description: string | null
          source_name: string | null
          source_url: string | null
          contact_name: string | null
          contact_email: string | null
          compensation: string | null
          fit_score: number | null
          status: string
          created_at: string
        },
        {
          id?: string
          user_id: string
          campaign_id?: string | null
          company_name: string
          title: string
          description?: string | null
          source_name?: string | null
          source_url?: string | null
          contact_name?: string | null
          contact_email?: string | null
          compensation?: string | null
          fit_score?: number | null
          status?: string
          created_at?: string
        }
      >
      pitches: Table<
        { id: string; user_id: string; opportunity_id: string | null; subject: string | null; body: string; created_at: string },
        { id?: string; user_id: string; opportunity_id?: string | null; subject?: string | null; body?: string; created_at?: string }
      >
      outreach: Table<
        { id: string; user_id: string; opportunity_id: string | null; pitch_id: string | null; channel: string; status: string; sent_at: string | null; responded_at: string | null; notes: string | null; created_at: string },
        { id?: string; user_id: string; opportunity_id?: string | null; pitch_id?: string | null; channel?: string; status?: string; sent_at?: string | null; responded_at?: string | null; notes?: string | null; created_at?: string }
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
