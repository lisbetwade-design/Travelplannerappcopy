-- Create users table for additional user data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  total_pto_days INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_off table for storing selected days off
CREATE TABLE IF NOT EXISTS public.time_off (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create trips table for storing created trips
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget TEXT,
  activities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for time_off table
CREATE POLICY "Users can view own time off" ON public.time_off
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time off" ON public.time_off
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own time off" ON public.time_off
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for trips table
CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_time_off_user_id ON public.time_off(user_id);
CREATE INDEX IF NOT EXISTS idx_time_off_date ON public.time_off(date);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON public.trips(start_date, end_date);
