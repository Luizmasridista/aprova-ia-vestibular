export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          all_day: boolean | null
          color: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string
          id: string
          is_recurring: boolean | null
          priority: number | null
          recurrence_pattern: Json | null
          reminder_minutes: number | null
          start_date: string
          status: string | null
          study_plan_id: string | null
          subject: string | null
          title: string
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          color?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          priority?: number | null
          recurrence_pattern?: Json | null
          reminder_minutes?: number | null
          start_date: string
          status?: string | null
          study_plan_id?: string | null
          subject?: string | null
          title: string
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          color?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          priority?: number | null
          recurrence_pattern?: Json | null
          reminder_minutes?: number | null
          start_date?: string
          status?: string | null
          study_plan_id?: string | null
          subject?: string | null
          title?: string
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exam_questions: {
        Row: {
          exam_id: string
          position: number | null
          question_id: string
        }
        Insert: {
          exam_id: string
          position?: number | null
          question_id: string
        }
        Update: {
          exam_id?: string
          position?: number | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          total_questions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_results: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          is_correct: boolean
          time_spent: number
          user_answer: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          is_correct: boolean
          time_spent?: number
          user_answer: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          is_correct?: boolean
          time_spent?: number
          user_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_results_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sessions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          id: string
          options: Json
          question: string
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          id?: string
          options: Json
          question: string
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercise_usage_limits: {
        Row: {
          created_at: string | null
          daily_requests: number | null
          id: string
          last_request_date: string | null
          total_requests: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_requests?: number | null
          id?: string
          last_request_date?: string | null
          total_requests?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_requests?: number | null
          id?: string
          last_request_date?: string | null
          total_requests?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_calendar_event_mappings: {
        Row: {
          created_at: string | null
          google_calendar_id: string
          google_event_id: string
          id: string
          last_synced_at: string | null
          local_event_id: string
          sync_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          google_calendar_id?: string
          google_event_id: string
          id?: string
          last_synced_at?: string | null
          local_event_id: string
          sync_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          google_calendar_id?: string
          google_event_id?: string
          id?: string
          last_synced_at?: string | null
          local_event_id?: string
          sync_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_calendar_event_mappings_local_event_id_fkey"
            columns: ["local_event_id"]
            isOneToOne: true
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      google_calendar_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          google_calendar_id: string
          id: string
          is_enabled: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          sync_direction: string | null
          sync_error: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          google_calendar_id?: string
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_direction?: string | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          google_calendar_id?: string
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_direction?: string | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          created_at: string | null
          events_current: number | null
          events_target: number
          id: string
          intensity: string
          month: string
          reasoning: string | null
          streak_current: number | null
          streak_target: number
          study_hours_current: number | null
          study_hours_target: number
          study_plan_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events_current?: number | null
          events_target?: number
          id?: string
          intensity?: string
          month: string
          reasoning?: string | null
          streak_current?: number | null
          streak_target?: number
          study_hours_current?: number | null
          study_hours_target?: number
          study_plan_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          events_current?: number | null
          events_target?: number
          id?: string
          intensity?: string
          month?: string
          reasoning?: string | null
          streak_current?: number | null
          streak_target?: number
          study_hours_current?: number | null
          study_hours_target?: number
          study_plan_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_goals_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_questions: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          options: Json | null
          position: number
          question_text: string
          question_type: string
          questionnaire_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          position: number
          question_text: string
          question_type: string
          questionnaire_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          position?: number
          question_text?: string
          question_type?: string
          questionnaire_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_questions_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          mode: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          mode: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          mode?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          alternatives: Json
          correct_alternative: string
          created_at: string | null
          difficulty: number | null
          explanation: string | null
          id: string
          statement: string
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          alternatives: Json
          correct_alternative: string
          created_at?: string | null
          difficulty?: number | null
          explanation?: string | null
          id?: string
          statement: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alternatives?: Json
          correct_alternative?: string
          created_at?: string | null
          difficulty?: number | null
          explanation?: string | null
          id?: string
          statement?: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string | null
          daily_goals: Json
          description: string | null
          end_date: string
          exam_suggestions: Json | null
          id: string
          is_active: boolean | null
          mode: string
          name: string
          revision_suggestions: Json | null
          start_date: string
          target_course: string | null
          target_date: string | null
          target_institution: string | null
          updated_at: string | null
          user_id: string | null
          weekly_schedule: Json
        }
        Insert: {
          created_at?: string | null
          daily_goals: Json
          description?: string | null
          end_date: string
          exam_suggestions?: Json | null
          id?: string
          is_active?: boolean | null
          mode: string
          name: string
          revision_suggestions?: Json | null
          start_date: string
          target_course?: string | null
          target_date?: string | null
          target_institution?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_schedule: Json
        }
        Update: {
          created_at?: string | null
          daily_goals?: Json
          description?: string | null
          end_date?: string
          exam_suggestions?: Json | null
          id?: string
          is_active?: boolean | null
          mode?: string
          name?: string
          revision_suggestions?: Json | null
          start_date?: string
          target_course?: string | null
          target_date?: string | null
          target_institution?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_schedule?: Json
        }
        Relationships: []
      }
      subjects: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          position: number | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          position?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          position: number | null
          subject_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          position?: number | null
          subject_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          position?: number | null
          subject_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          created_at: string | null
          exam_id: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          selected_alternative: string | null
          time_spent_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exam_id?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_alternative?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exam_id?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_alternative?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          correct_answers: number | null
          last_accessed: string | null
          questions_answered: number | null
          topic_id: string
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          last_accessed?: string | null
          questions_answered?: number | null
          topic_id: string
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          last_accessed?: string | null
          questions_answered?: number | null
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_questionnaire_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          questionnaire_id: string | null
          response_value: string
          study_plan_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          questionnaire_id?: string | null
          response_value: string
          study_plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          questionnaire_id?: string | null
          response_value?: string
          study_plan_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_questionnaire_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_questionnaire_responses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_questionnaire_responses_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          password_hash: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          password_hash: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          password_hash?: string
          phone?: string | null
          role?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
