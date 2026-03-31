-- BluLoomAI - Initial Database Schema
-- Supabase-compatible PostgreSQL
-- Run in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ USERS (Clerk sync - optional, for RLS) ============
-- Clerk handles auth; we store minimal user reference for RLS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);

-- ============ INSTAGRAM ACCOUNTS ============
CREATE TABLE IF NOT EXISTS instagram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instagram_business_account_id TEXT NOT NULL,
  username TEXT NOT NULL,
  followers_count INTEGER NOT NULL DEFAULT 0,
  profile_picture_url TEXT,
  access_token_encrypted TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(instagram_business_account_id)
);

CREATE INDEX idx_instagram_accounts_user ON instagram_accounts(user_id);
CREATE INDEX idx_instagram_accounts_ig_id ON instagram_accounts(instagram_business_account_id);

-- ============ POSTS ============
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_account_id UUID NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  instagram_post_id TEXT NOT NULL,
  caption TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  media_url TEXT,
  permalink TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(instagram_account_id, instagram_post_id)
);

CREATE INDEX idx_posts_account ON posts(instagram_account_id);
CREATE INDEX idx_posts_timestamp ON posts(timestamp DESC);
CREATE INDEX idx_posts_engagement ON posts(instagram_account_id, like_count, comment_count);

-- ============ POST METRICS (denormalized for analytics) ============
CREATE TABLE IF NOT EXISTS post_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  instagram_account_id UUID NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  followers_at_post INTEGER NOT NULL,
  engagement_rate DECIMAL(10, 4) NOT NULL,
  day_of_week SMALLINT NOT NULL,
  hour_of_day SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id)
);

CREATE INDEX idx_post_metrics_account ON post_metrics(instagram_account_id);
CREATE INDEX idx_post_metrics_day_hour ON post_metrics(instagram_account_id, day_of_week, hour_of_day);

-- ============ COMMENTS ============
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  instagram_comment_id TEXT NOT NULL,
  text TEXT NOT NULL,
  username TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, instagram_comment_id)
);

CREATE INDEX idx_comments_post ON comments(post_id);

-- ============ ANALYSIS RESULTS (AI output) ============
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  instagram_account_id UUID NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  result JSONB NOT NULL,
  model_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id)
);

CREATE INDEX idx_analysis_results_account ON analysis_results(instagram_account_id);

-- ============ CONTENT GENERATIONS ============
CREATE TABLE IF NOT EXISTS content_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instagram_account_id UUID REFERENCES instagram_accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('reel_script', 'caption', 'hook_optimizer')),
  input_params JSONB,
  output JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_generations_user_date ON content_generations(user_id, created_at DESC);

-- ============ GROWTH REPORTS (cached viral pattern / posting time) ============
CREATE TABLE IF NOT EXISTS growth_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_account_id UUID NOT NULL REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('viral_pattern', 'posting_time', 'full')),
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_growth_reports_account_type ON growth_reports(instagram_account_id, report_type);

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Clerk user_id from JWT)
-- Note: Supabase uses auth.jwt() - you'll need to sync Clerk user_id
-- For now, policies use user_id from instagram_accounts join

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (clerk_user_id = current_setting('app.clerk_user_id', true));

CREATE POLICY "Users can read own instagram_accounts" ON instagram_accounts
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
  );

CREATE POLICY "Users can read own posts via account" ON posts
  FOR ALL USING (
    instagram_account_id IN (
      SELECT id FROM instagram_accounts
      WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
    )
  );

CREATE POLICY "Users can read own post_metrics" ON post_metrics
  FOR ALL USING (
    instagram_account_id IN (
      SELECT id FROM instagram_accounts
      WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
    )
  );

CREATE POLICY "Users can read own comments via posts" ON comments
  FOR ALL USING (
    post_id IN (
      SELECT p.id FROM posts p
      JOIN instagram_accounts ia ON p.instagram_account_id = ia.id
      JOIN users u ON ia.user_id = u.id
      WHERE u.clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

CREATE POLICY "Users can read own analysis_results" ON analysis_results
  FOR ALL USING (
    instagram_account_id IN (
      SELECT id FROM instagram_accounts
      WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
    )
  );

CREATE POLICY "Users can read own content_generations" ON content_generations
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
  );

CREATE POLICY "Users can read own growth_reports" ON growth_reports
  FOR ALL USING (
    instagram_account_id IN (
      SELECT id FROM instagram_accounts
      WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
    )
  );

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER instagram_accounts_updated_at
  BEFORE UPDATE ON instagram_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
