# Database Migration Instructions

## How to Apply the Migration

The migration file `20240104_create_tables.sql` creates the necessary database tables for the Oooff travel planner app.

### Option 1: Through Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `20240104_create_tables.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed locally:

```bash
supabase db push
```

## Tables Created

- **users** - Stores user profile data (country, total PTO days)
- **time_off** - Stores selected time off dates
- **trips** - Stores created trips with destinations, dates, and details

## Verification

After running the migration, you can verify the tables were created by running:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'time_off', 'trips');
```

All three tables should be listed in the results.
