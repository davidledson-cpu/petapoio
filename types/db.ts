// Tipos das tabelas usadas pela aplicação (espelham supabase/migrations).
import type { CareLevel, CareService, PetSize, Species } from '@/lib/cuida-shared'
import type { TrainingFocus, TrainingFormat, TrainingModality } from '@/lib/adestra-shared'

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
  care_fee_percent?: number
  booking_hold_minutes: number
  min_notice_hours: number
  cancel_refund_hours: number
  shipping_flat_cents: number
  free_shipping_from_cents: number
}

// ── PetApoio Cuida ───────────────────────────────────────────────────────────

export type Caregiver = {
  id: string
  slug: string | null
  status: 'pendente' | 'aprovado' | 'recusado' | 'suspenso'
  level: CareLevel
  review_note: string | null
  full_name: string
  email: string
  phone: string
  city: string
  neighborhood: string
  radius_km: number
  services: CareService[]
  species: Species[]
  pet_sizes: PetSize[]
  headline: string | null
  bio: string | null
  experience: string | null
  qualifications: string | null
  price_hosting_cents: number | null
  price_visit_cents: number | null
  price_walk_cents: number | null
  price_daycare_cents: number | null
  gives_medication: boolean
  accepts_seniors: boolean
  accepts_puppies: boolean
  has_yard: boolean
  accepted_terms_at: string
  approved_at: string | null
  created_at: string
}

export type Trainer = {
  id: string
  slug: string | null
  status: 'pendente' | 'aprovado' | 'recusado' | 'suspenso'
  review_note: string | null
  full_name: string
  email: string
  phone: string
  city: string
  neighborhood: string
  radius_km: number
  modalities: TrainingModality[]
  species: Species[]
  focus: TrainingFocus[]
  formats: TrainingFormat[]
  price_assessment_cents: number | null
  price_class_cents: number | null
  price_package_cents: number | null
  price_consult_cents: number | null
  package_classes: number | null
  years_experience: number
  headline: string | null
  experience: string | null
  qualifications: string | null
  portfolio_url: string | null
  positive_methods: boolean
  accepted_terms_at: string
  approved_at: string | null
  created_at: string
}

/** Linha da view pública caregiver_directory (sem contato nem observações internas). */
export type CaregiverEntry = Omit<Caregiver, 'status' | 'review_note' | 'email' | 'phone' | 'accepted_terms_at' | 'created_at'>

export type CareRequest = {
  id: string
  code: string
  tutor_id: string
  caregiver_id: string
  service: CareService
  start_date: string
  end_date: string
  pet_name: string
  species: Species
  pet_size: PetSize
  pet_notes: string | null
  message: string | null
  units: number
  unit_cents: number
  estimated_cents: number
  fee_percent: number
  status: 'nova' | 'em_contato' | 'confirmada' | 'concluida' | 'cancelada'
  admin_note: string | null
  created_at: string
  updated_at: string
}

// ── PetApoio Saúde ───────────────────────────────────────────────────────────
export type Pet = {
  id: string
  owner_id: string
  name: string
  species: Species
  breed: string | null
  birth_date: string | null
  weight_kg: number | null
  notes: string | null
  created_at: string
}

export type PetHealthEvent = {
  id: number
  pet_id: string
  kind: 'vacina' | 'vermifugo' | 'consulta' | 'exame' | 'medicamento' | 'outro'
  title: string
  occurred_on: string
  next_due_on: string | null
  notes: string | null
  created_at: string
}

export type HealthLead = {
  id: number
  email: string
  city: string | null
  species: Species
  pet_age: 'filhote' | 'adulto' | 'idoso'
  interests: string[]
  budget: string | null
  consented_at: string
}
