-- ═══════════════════════════════════════════════════════════
-- THE DOCKER LIBRARY - SUPABASE SETUP
-- ═══════════════════════════════════════════════════════════

-- 1. CREATE COMMUNITY TEMPLATES TABLE
CREATE TABLE community_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT NOT NULL,
  yaml_content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_community BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATE INDEXES
CREATE INDEX idx_community_templates_user_id ON community_templates(user_id);
CREATE INDEX idx_community_templates_template_id ON community_templates(template_id);
CREATE INDEX idx_community_templates_is_community ON community_templates(is_community);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE community_templates ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES

-- Policy: Users can view their own templates and all community templates
CREATE POLICY "Users can view own and community templates"
  ON community_templates
  FOR SELECT
  USING (
    is_community = TRUE 
    OR auth.uid() = user_id
  );

-- Policy: Users can insert their own templates
CREATE POLICY "Users can insert own templates"
  ON community_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own templates
CREATE POLICY "Users can update own templates"
  ON community_templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own templates
CREATE POLICY "Users can delete own templates"
  ON community_templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. CREATE FUNCTION TO AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREATE TRIGGER
CREATE TRIGGER update_community_templates_updated_at
  BEFORE UPDATE ON community_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. GRANT PERMISSIONS
GRANT ALL ON community_templates TO authenticated;
GRANT SELECT ON community_templates TO anon;

-- ═══════════════════════════════════════════════════════════
-- OPTIONAL: SAMPLE DATA FOR TESTING
-- ═══════════════════════════════════════════════════════════

-- Uncomment to insert sample community templates
/*
INSERT INTO community_templates (template_id, yaml_content, user_id, is_community) VALUES
(
  'sample-nginx',
  'version: ''3.8''

services:
  nginx:
    image: nginx:alpine
    ports:
      - "5001:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: unless-stopped',
  (SELECT id FROM auth.users LIMIT 1),
  TRUE
);
*/

-- ═══════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'community_templates';

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename = 'community_templates';

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'community_templates';

-- ═══════════════════════════════════════════════════════════
-- CLEANUP (if needed)
-- ═══════════════════════════════════════════════════════════

-- Uncomment to drop everything
/*
DROP TRIGGER IF EXISTS update_community_templates_updated_at ON community_templates;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP POLICY IF EXISTS "Users can view own and community templates" ON community_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON community_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON community_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON community_templates;
DROP TABLE IF EXISTS community_templates;
*/
