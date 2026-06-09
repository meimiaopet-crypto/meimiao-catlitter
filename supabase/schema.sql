-- =============================================
-- CatLitter Trade Academy - Supabase Schema
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- =============================================
-- Categories (栏目)
-- =============================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,                    -- emoji or icon name
  color       TEXT DEFAULT '#16a34a', -- green theme
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Tags (标签)
-- =============================================
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  color      TEXT DEFAULT '#16a34a',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Posts (知识文章)
-- =============================================
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  summary       TEXT,
  content       TEXT NOT NULL DEFAULT '',  -- Markdown content
  cover_image   TEXT,                       -- URL
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  difficulty    TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')) DEFAULT 'beginner',
  status        TEXT CHECK (status IN ('draft','published','archived')) DEFAULT 'draft',
  view_count    INTEGER DEFAULT 0,
  read_time     INTEGER DEFAULT 5,         -- estimated minutes
  author_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  -- Full-text search vector
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED
);

-- =============================================
-- Post Tags (文章-标签 多对多)
-- =============================================
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- =============================================
-- Admin Profiles (管理员信息)
-- =============================================
CREATE TABLE admin_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  role       TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Site Settings (站点配置)
-- =============================================
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'CatLitter Trade Academy'),
  ('site_description', 'Professional knowledge base for cat litter foreign trade'),
  ('contact_email', 'info@catlitteracademy.com'),
  ('icp_number', ''),
  ('hero_title', 'Master Cat Litter Foreign Trade'),
  ('hero_subtitle', 'From product knowledge to customs compliance — your complete trade toolkit');

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_tags_slug ON tags(slug);

-- =============================================
-- Triggers: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read tags"
  ON tags FOR SELECT USING (TRUE);

CREATE POLICY "Public can read post_tags"
  ON post_tags FOR SELECT USING (TRUE);

-- Admin full access (authenticated users with admin_profiles row)
CREATE POLICY "Admins can do everything on categories"
  ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on posts"
  ON posts FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on tags"
  ON tags FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on post_tags"
  ON post_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can read their own profile"
  ON admin_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- =============================================
-- Function: Increment view count
-- =============================================
CREATE OR REPLACE FUNCTION increment_view_count(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Seed Data: Default Categories
-- =============================================
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('产品知识', 'product-knowledge', '豆腐猫砂、膨润土、活性炭猫砂等产品专业知识与出口优势', '🐱', 1),
  ('外贸术语与英语', 'trade-terms', '外贸必备英语术语、函电写作、谈判技巧', '📖', 2),
  ('单证与付款', 'documents-payment', 'LC信用证、TT电汇、单证审核、风险防范（核心栏目）', '💳', 3),
  ('国际物流与货运', 'logistics', '集装箱、海运空运、Incoterms 2020、货代选择', '🚢', 4),
  ('外贸营销与客户开发', 'marketing', 'Google开发客户、邮件营销、展会技巧、社媒推广', '📣', 5),
  ('海关合规与认证', 'compliance', 'HS编码、出口退税、CE/REACH认证、海关审查', '✅', 6),
  ('外贸合同与风险控制', 'contracts-risk', '合同条款、贸易纠纷、汇率风险、信用风险管理', '⚖️', 7),
  ('平台运营', 'platform-ops', '阿里巴巴国际站、Amazon B2B、Shopee、独立站运营', '🛒', 8),
  ('实用工具与模板', 'tools-templates', '报价单模板、合同模板、HS编码查询、汇率计算', '🧰', 9),
  ('案例分析与实战', 'case-studies', '真实外贸案例解析、失败教训、成功经验总结', '📊', 10);

-- Seed Data: Default Tags
INSERT INTO tags (name, slug, color) VALUES
  ('豆腐猫砂', 'tofu-cat-litter', '#16a34a'),
  ('膨润土', 'bentonite', '#ca8a04'),
  ('活性炭', 'activated-carbon', '#374151'),
  ('信用证', 'letter-of-credit', '#1d4ed8'),
  ('TT电汇', 'tt-payment', '#7c3aed'),
  ('Incoterms', 'incoterms', '#0891b2'),
  ('HS编码', 'hs-code', '#dc2626'),
  ('FOB', 'fob', '#ea580c'),
  ('海运', 'sea-freight', '#0284c7'),
  ('阿里国际站', 'alibaba', '#f97316'),
  ('Amazon', 'amazon', '#d97706'),
  ('OEM/ODM', 'oem-odm', '#7c3aed'),
  ('入门', 'beginner', '#16a34a'),
  ('进阶', 'advanced', '#dc2626'),
  ('模板', 'template', '#6d28d9');
