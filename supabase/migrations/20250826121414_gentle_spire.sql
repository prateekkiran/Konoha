/*
  # Portfolio Website Database Schema

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp)
    
    - `page_views`
      - `id` (uuid, primary key)
      - `page` (text, required)
      - `user_agent` (text, optional)
      - `referrer` (text, optional)
      - `created_at` (timestamp)
    
    - `filter_usage`
      - `id` (uuid, primary key)
      - `filter_name` (text, required)
      - `search_term` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to insert data
    - Contact submissions are insert-only for public users
*/

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Page views table for analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track page views"
  ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Filter usage tracking
CREATE TABLE IF NOT EXISTS filter_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_name text NOT NULL,
  search_term text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE filter_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track filter usage"
  ON filter_usage
  FOR INSERT
  TO anon
  WITH CHECK (true);