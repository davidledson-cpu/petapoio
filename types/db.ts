// Tipos das tabelas usadas pela aplicação (espelham supabase/migrations).

export type Role = 'paciente' | 'psicologo' | 'admin'

export type Profile = {
  id: string
  role: Role
  full_name: string
  phone: string | null
  created_at: string
}

export type Modality = 'online' | 'presencial' | 'ambos'

export type Psychologist = {
  id: string
  slug: string | null
  status: 'pendente' | 'aprovado' | 'recusado' | 'suspenso'
  review_note: string | null
  crp: string
  crp_state: string
  headline: string | null
  bio: string | null
  education: string | null
  approach: string | null
  specialties: string[]
  pet_grief_experience: boolean
  serves_children: boolean
  serves_families: boolean
  modality: Modality
  city: string | null
  state: string | null
  languages: string[]
  session_price_cents: number | null
  session_minutes: number
  meeting_url: string | null
  photo_path: string | null
  document_path: string | null
  mp_connected: boolean
  accepted_terms_at: string | null
  approved_at: string | null
  created_at: string
}

/** Linha da view pública psychologist_directory. */
export type DirectoryEntry = Pick<
  Psychologist,
  | 'id' | 'slug' | 'crp' | 'crp_state' | 'headline' | 'bio' | 'education' | 'approach' | 'specialties'
  | 'pet_grief_experience' | 'serves_children' | 'serves_families' | 'modality' | 'city' | 'state'
  | 'languages' | 'session_price_cents' | 'session_minutes' | 'photo_path' | 'mp_connected' | 'approved_at'
> & { full_name: string }

export type Availability = {
  id: number
  psychologist_id: string
  weekday: number
  start_time: string
  end_time: string
}

export type TimeOff = { id: number; psychologist_id: string; starts_at: string; ends_at: string; reason: string | null }

export type AppointmentStatus =
  | 'aguardando_pagamento' | 'confirmado' | 'cancelado' | 'concluido' | 'nao_compareceu' | 'expirado'

export type Appointment = {
  id: string
  patient_id: string
  psychologist_id: string
  starts_at: string
  ends_at: string
  status: AppointmentStatus
  price_cents: number
  platform_fee_cents: number
  hold_expires_at: string | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  paid_at: string | null
  refunded_at: string | null
  cancelled_by: string | null
  cancelled_at: string | null
  created_at: string
}

export type ProductCategory = 'memorias' | 'lembrancas' | 'acolhimento' | 'presentes'

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  summary: string
  description: string
  price_cents: number
  production_days: number
  needs_photo: boolean
  needs_name: boolean
  images: string[]
  active: boolean
  sort_order: number
}

export type OrderStatus = 'aguardando_pagamento' | 'pago' | 'em_producao' | 'enviado' | 'entregue' | 'cancelado'

export type Order = {
  id: string
  code: string
  user_id: string | null
  email: string
  full_name: string
  phone: string | null
  address: Record<string, string>
  subtotal_cents: number
  shipping_cents: number
  total_cents: number
  status: OrderStatus
  tracking_code: string | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  paid_at: string | null
  created_at: string
}

export type OrderItem = {
  id: number
  order_id: string
  product_id: string | null
  product_name: string
  unit_price_cents: number
  quantity: number
  personalization_name: string | null
  personalization_photo: string | null
}

export type Notification = {
  id: number
  user_id: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export type PlatformSettings = {
  platform_fee_percent: number
  booking_hold_minutes: number
  min_notice_hours: number
  cancel_refund_hours: number
  shipping_flat_cents: number
  free_shipping_from_cents: number
}
