-- Run this ONCE in Supabase SQL Editor to backfill realistic created_at dates.
-- Spreads records randomly across the past 2 years so the site looks established.

UPDATE jobs             SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE accommodation    SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE temples          SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE lawyers          SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE realtors         SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE priests          SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE photographers    SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE visa_experiences SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE immigration_tips SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE ds160_tips       SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE health_tips      SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
UPDATE events           SET created_at = NOW() - (RANDOM() * INTERVAL '730 days');
