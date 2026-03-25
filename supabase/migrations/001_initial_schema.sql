-- ============================================================
-- PETAPOIO — Initial Database Schema
-- Run in Supabase SQL Editor or via Supabase CLI
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('patient', 'professional', 'admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE professional_tier AS ENUM ('basic', 'pro', 'premium');
CREATE TYPE loss_type AS ENUM ('death', 'disappearance', 'separation', 'other');
CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'bird', 'other');

-- ─── TABLES ───────────────────────────────────────────────────────────────────

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  subscription_plan subscription_plan DEFAULT 'free',
  -- Gamification
  gamification_points INTEGER DEFAULT 0,
  gamification_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_check_in TIMESTAMPTZ,
  -- Onboarding data
  pet_name TEXT,
  pet_species pet_species,
  loss_type loss_type,
  loss_time TEXT,
  initial_mood_score INTEGER
);

-- Professional profiles (extends users)
CREATE TABLE professional_profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  crp_number TEXT,
  crm_number TEXT,
  specialty TEXT[] DEFAULT '{}',
  bio TEXT,
  short_bio TEXT,
  video_intro_url TEXT,
  session_price DECIMAL(10,2) DEFAULT 150.00,
  session_duration INTEGER DEFAULT 50, -- minutes
  buffer_time INTEGER DEFAULT 10, -- minutes between sessions
  calendar_id TEXT,
  stripe_account_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  subscription_tier professional_tier DEFAULT 'basic',
  subscription_expires_at TIMESTAMPTZ,
  rating_avg DECIMAL(2,1) DEFAULT 0.0,
  total_sessions INTEGER DEFAULT 0,
  accepts_emergency BOOLEAN DEFAULT FALSE,
  emergency_price DECIMAL(10,2),
  languages TEXT[] DEFAULT '{Português}',
  approach TEXT[] DEFAULT '{}',
  cancellation_policy_hours INTEGER DEFAULT 24,
  crp_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 50,
  status appointment_status DEFAULT 'pending',
  -- Video
  video_room_url TEXT,
  video_room_id TEXT,
  video_room_expires_at TIMESTAMPTZ,
  -- Payment
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  professional_amount DECIMAL(10,2) DEFAULT 0,
  -- Notes
  notes_patient TEXT,
  notes_professional TEXT,
  -- Review
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  review_is_public BOOLEAN DEFAULT TRUE,
  reviewed_at TIMESTAMPTZ,
  -- Metadata
  is_emergency BOOLEAN DEFAULT FALSE,
  cal_booking_uid TEXT,
  cancelled_by UUID REFERENCES users(id),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient badges / achievements
CREATE TABLE patient_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, badge_key)
);

-- Daily check-ins
CREATE TABLE check_ins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_score SMALLINT NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professional availability (slots)
CREATE TABLE availability_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week SMALLINT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability blocks (one-off unavailability)
CREATE TABLE availability_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_from TIMESTAMPTZ NOT NULL,
  blocked_until TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification log
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'appointment_reminder', 'new_booking', 'badge_earned', etc.
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_check_ins_patient ON check_ins(patient_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_professional_profiles_verified ON professional_profiles(is_verified);
CREATE INDEX idx_users_role ON users(role);

-- Full-text search on professional names
CREATE INDEX idx_users_fullname_trgm ON users USING gin(full_name gin_trgm_ops);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: read own + professionals can see patient basics
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Verified professionals are publicly visible" ON users FOR SELECT USING (
  role = 'professional' AND is_active = TRUE
);

-- Professional profiles: publicly readable when verified
CREATE POLICY "Professional profiles are public when verified" ON professional_profiles
  FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Professionals can manage own profile" ON professional_profiles
  FOR ALL USING (auth.uid() = id);

-- Appointments: patient and professional can see their own
CREATE POLICY "Patients see own appointments" ON appointments
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals see own appointments" ON appointments
  FOR SELECT USING (auth.uid() = professional_id);
CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Participants can update appointments" ON appointments
  FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = professional_id);

-- Badges: patients see own
CREATE POLICY "Patients see own badges" ON patient_badges FOR SELECT USING (auth.uid() = patient_id);

-- Check-ins: patients see own
CREATE POLICY "Patients see own check-ins" ON check_ins FOR ALL USING (auth.uid() = patient_id);

-- Availability: public read, professional write
CREATE POLICY "Availability is publicly readable" ON availability_slots FOR SELECT USING (TRUE);
CREATE POLICY "Professionals manage own availability" ON availability_slots FOR ALL USING (auth.uid() = professional_id);
CREATE POLICY "Professionals manage own blocks" ON availability_blocks FOR ALL USING (auth.uid() = professional_id);

-- Notifications: users see own
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ─── FUNCTIONS & TRIGGERS ─────────────────────────────────────────────────────

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Award points to patient
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT DEFAULT ''
)
RETURNS INTEGER AS $$
DECLARE
  new_points INTEGER;
  new_level INTEGER;
BEGIN
  UPDATE users
  SET gamification_points = gamification_points + p_points
  WHERE id = p_user_id
  RETURNING gamification_points INTO new_points;

  -- Update level based on points
  new_level := CASEWHEN new_points >= 2500 THEN 5
    WHEN new_points >= 1000 THEN 4
    WHEN new_points >= 500  THEN 3
    WHEN new_points >= 200  THEN 2
    ELSE 1
  END;

  UPDATE users SET gamification_level = new_level WHERE id = p_user_id;

  RETURN new_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award badge to patient (idempotent)
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_key TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO patient_badges (patient_id, badge_key)
  VALUES (p_user_id, p_badge_key)
  ON CONFLICT (patient_id, badge_key) DO NOTHING;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post-appointment hooks (award points, update stats)
CREATE OR REPLACE FUNCTION handle_appointment_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Award points to patient
    PERFORM award_points(NEW.patient_id, 30, 'session_completed');

    -- Check for first session badge
    PERFORM award_badge(NEW.patient_id, 'first_session');

    -- Update professional stats
    UPDATE professional_profiles
    SET total_sessions = total_sessions + 1
    WHERE id = NEW.professional_id;

    -- Create notifications
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.patient_id,
      'session_completed',
      'Sessão concluída!',
      'Você ganhou 30 pontos. Como foi sua sessão? Avalie seu profissional.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_appointment_completed
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION handle_appointment_completed();

-- Update professional rating when review is added
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating IS NOT NULL AND OLD.rating IS NULL THEN
    UPDATE professional_profiles
    SET rating_avg = (
      SELECT AVF(rating)::DECIMAL(2,1)
      FROM appointments
      WHERE professional_id = NEW.professional_id AND rating IS NOT NULL
    )
    WHERE id = NEW.professional_id;

    -- Award points to patient for reviewing
    PERFORM award_points(NEW.patient_id, 15, 'review_given');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_appointment_rated
  AGTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_professional_rating();

-- ─── SEED DATA (for development) :
-- Uncomment to run seed data (development only)

/*
-- Create test professional
INSERT INTO users (id, email, role, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'psicologa@test.com', 'professional', 'Dra. Ana Paula Ferreira');

INSERT INTO professional_profiles (id, crp_number, specialty, bio, short_bio, session_price, is_verified, rating_avg, total_sessions) VALUES
  ('00000000-0000-0000-0000-000000000001', 'CRP 06/123456',
   '{Luto Animal,Trauma,Ansiedade}',
   'Psicóloga clínica com 8 anos de experiência em luto por perda de animais de estimação.',
   'Especialista em luto animal e trauma.',
   150.00, TRUE, 5.0, 48);
*/
