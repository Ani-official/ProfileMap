/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `photo_url` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `address` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for CRUD operations
*/

CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  photo_url text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

-- Allow authenticated users to create profiles
CREATE POLICY "Users can create their own profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profiles
CREATE POLICY "Users can update their own profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profiles
CREATE POLICY "Users can delete their own profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);