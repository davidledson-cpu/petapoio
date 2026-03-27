-- ============================================================
-- PETAPOIO — Platform Settings Table
-- Stores admin-configurable settings like notification emails
-- ============================================================

-- Platform settings (key-value store for admin configs)
CREATE TABLE platform_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write settings
CREATE POLICY "Admins can manage platform settings" ON platform_settings
  FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Public read for specific keys needed by the system
CREATE POLICY "System can read notification settings" ON platform_settings
  FOR SELECT USING (key LIKE 'notification_%');

-- Add trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed the notification email setting
INSERT INTO platform_settings (key, value, description)
VALUES (
    'notification_email_appointments',
    '',
    'Email que recebe notificações de novos agendamentos de consultas'
  );
