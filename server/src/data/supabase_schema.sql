-- ==========================================================
-- Sahayak Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Programs Table (NGO Support Schemes)
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ngoName TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT DEFAULT '',
  tagline TEXT,
  description TEXT,
  minAge INT DEFAULT 16,
  maxAge INT DEFAULT 60,
  maxAnnualIncome NUMERIC DEFAULT 300000,
  locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  allowedEducation TEXT[] DEFAULT ARRAY[]::TEXT[],
  targetGoals TEXT[] DEFAULT ARRAY[]::TEXT[],
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  documentsRequired TEXT[] DEFAULT ARRAY[]::TEXT[],
  duration TEXT DEFAULT 'Flexible',
  fundingAmount TEXT DEFAULT 'Full Sponsorship',
  seatsRemaining INT DEFAULT 50,
  deadline TEXT DEFAULT 'Open Year-Round',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Applications Table (Beneficiary Submissions)
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  beneficiaryName TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  originalPrompt TEXT NOT NULL,
  programId TEXT REFERENCES programs(id) ON DELETE SET NULL,
  programName TEXT NOT NULL,
  ngoName TEXT NOT NULL,
  extractedProfile JSONB DEFAULT '{}'::JSONB,
  matchScore INT DEFAULT 95,
  verificationMatrix JSONB DEFAULT '{"ageMatch": true, "locationMatch": true, "incomeMatch": true, "goalMatch": true}'::JSONB,
  status TEXT DEFAULT 'Pending Review',
  submittedAt TEXT,
  documentsUploaded TEXT[] DEFAULT ARRAY[]::TEXT[],
  staffNotes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) and Public read/insert policies
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated/service insert on programs" ON programs FOR ALL USING (true);

CREATE POLICY "Allow public read on applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on applications" ON applications FOR UPDATE USING (true);
