export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          content: string
          cover_image: string | null
          category_id: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          status: 'draft' | 'published' | 'archived'
          view_count: number
          read_time: number
          author_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          content?: string
          cover_image?: string | null
          category_id?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          status?: 'draft' | 'published' | 'archived'
          view_count?: number
          read_time?: number
          author_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          summary?: string | null
          content?: string
          cover_image?: string | null
          category_id?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          status?: 'draft' | 'published' | 'archived'
          view_count?: number
          read_time?: number
          author_id?: string | null
          published_at?: string | null
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          color?: string
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      admin_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
        }
      }
      site_settings: {
        Row: {
          key: string
          value: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value?: string | null
        }
        Update: {
          value?: string | null
          updated_at?: string
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: { post_slug: string }
        Returns: void
      }
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type PostTag = Database['public']['Tables']['post_tags']['Row']
export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']

export type PostWithCategory = Post & {
  categories: Category | null
  post_tags: Array<{ tags: Tag }>
}

export type CategoryWithCount = Category & {
  post_count: number
}
