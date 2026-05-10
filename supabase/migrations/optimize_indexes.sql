-- Migration: optimize_indexes
-- Description: Add performance indexes to heavily queried analytical columns

-- Indexes for Dashboard DSA Stats
CREATE INDEX IF NOT EXISTS idx_user_progress_user_solved ON user_progress (user_id, solved);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON user_progress (updated_at DESC);

-- Indexes for Dashboard SQL Stats
CREATE INDEX IF NOT EXISTS idx_sql_progress_user_solved ON sql_progress (user_id, solved);
CREATE INDEX IF NOT EXISTS idx_sql_progress_updated_at ON sql_progress (updated_at DESC);

-- Index for Profiles streak (if not already indexed by primary key)
CREATE INDEX IF NOT EXISTS idx_profiles_id_streaks ON profiles (id, current_streak, longest_streak);
