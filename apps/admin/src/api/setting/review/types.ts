export interface ReviewRow {
  id: number
  status: number
  status_text: string
  reason?: string
  reviewer_id?: number
  reviewer_name?: string
  reviewed_at?: number
  created_at: number
  updated_at: number
  reviewable_type: string
  reviewable_id: number
  display_name?: string
  morph_alias?: string
  title: string
  content: string
  applicant: string
  [key: string]: any
  reviewer?: {
    id: number
    user_name: string
    real_name: string
    nick_name: string
  }
}

export interface ReviewListRequest {
  page?: number
  limit?: number
  title?: string
  type?: string
  status?: number
  applicant?: string
  LIKE_title?: string
  LIKE_applicant?: string
  reviewable_type?: string
}
