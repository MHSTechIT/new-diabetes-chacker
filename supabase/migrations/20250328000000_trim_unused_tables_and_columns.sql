-- Trim schema to what the Diabetes Checker app actually uses.
-- Run in Supabase SQL Editor after backup if you need retained lab columns.
--
-- Removes:
--   - blood_test_history (never queried by the app)
--   - test_reference_ranges (never queried by the app)
--   - blood_reports columns not used by BloodTestForm or DashboardHome

-- 1) Tables only used for optional / future features
DROP TABLE IF EXISTS blood_test_history CASCADE;
DROP TABLE IF EXISTS test_reference_ranges CASCADE;

-- 2) blood_reports: keep fields used by insert + select * dashboard
ALTER TABLE blood_reports DROP COLUMN IF EXISTS file_url;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS ast;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS alt;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS alkaline_phosphatase;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS total_bilirubin;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS creatinine;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS urea;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS uric_acid;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS hematocrit;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS wbc;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS platelets;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS tsh;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS bmi;
ALTER TABLE blood_reports DROP COLUMN IF EXISTS updated_at;
