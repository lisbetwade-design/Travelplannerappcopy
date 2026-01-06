# Oooff Travel Planner - Setup Instructions

## Prerequisites
You need a Supabase project to run this app. The app uses Supabase for authentication and database storage.

## Setup Steps

### 1. Create Database Tables

The app requires three database tables to store user data. You must run the migration SQL before using the app.

**To apply the migration:**

1. Open your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `/supabase/migrations/20240104_create_tables.sql` in your code editor
5. Copy all the SQL code (the entire file)
6. Paste it into the Supabase SQL Editor
7. Click **Run** to execute the migration

**Verify the tables were created:**

Run this query in the SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'time_off', 'trips');
```

You should see all three tables: `users`, `time_off`, and `trips`.

### 2. Deploy Edge Function

The edge function in `/supabase/functions/server/` handles user authentication and data storage.

**In Figma Make:**
- The edge function should be automatically deployed when you save the files

**To verify the edge function is deployed:**
1. Go to your Supabase dashboard
2. Navigate to **Edge Functions** in the left sidebar
3. You should see a function named `server` listed
4. The status should be "Deployed"

### 3. Test the App

1. Open the app in your browser
2. Click "Get Started" to begin onboarding
3. Complete the 2-step onboarding process:
   - Step 1: Select your country and enter total PTO days
   - Step 2: Create account with email and password
4. Check the browser console for any error messages

## Troubleshooting

### "Failed to fetch" Error

If you see this error during signup:

1. **Check Edge Function Deployment**
   - Open Supabase dashboard → Edge Functions
   - Ensure the `server` function is deployed and active
   - If not deployed, redeploy the function

2. **Check Database Tables**
   - The migration SQL must be run first
   - Check the SQL Editor to verify tables exist
   - Re-run the migration if needed

3. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look at the Console tab for detailed error messages
   - The app will show health check results and API responses

### Multiple GoTrueClient Instances Warning

This is a harmless warning during development (hot-reload). It won't affect functionality.

### Database Errors

If you see database-related errors in the Supabase logs:

1. Ensure the migration was run successfully
2. Check that Row Level Security (RLS) policies were created
3. Verify your Supabase project has the correct permissions

## Database Schema

### users table
- `id` - UUID (references auth.users)
- `country` - TEXT
- `total_pto_days` - INTEGER
- `created_at`, `updated_at` - TIMESTAMP

### time_off table
- `id` - UUID
- `user_id` - UUID (references auth.users)
- `date` - DATE
- `created_at` - TIMESTAMP

### trips table
- `id` - TEXT
- `user_id` - UUID (references auth.users)
- `destination` - TEXT
- `start_date`, `end_date` - DATE
- `budget`, `activities` - TEXT (nullable)
- `created_at`, `updated_at` - TIMESTAMP

## Support

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Check Supabase logs in the dashboard
3. Verify all setup steps were completed
4. Try clearing browser cache and localStorage
