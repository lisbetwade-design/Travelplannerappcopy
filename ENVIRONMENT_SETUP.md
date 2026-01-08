# Environment Setup for Supabase Integration

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   - Get your Project URL and Anon Key from https://app.supabase.com
   - Your API_BASE_URL should be: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-fe35748f`

3. Run the database migration:
   - Open Supabase SQL Editor
   - Run the SQL from `supabase/migrations/20240104_create_tables.sql`

4. Deploy the Edge Function:
   ```bash
   supabase functions deploy server
   ```

5. Start the app:
   ```bash
   npm install
   npm run dev
   ```

## Testing the Integration

### Sign Up Flow
1. Navigate to the app
2. Click "Sign Up"
3. Enter email and password
4. Select country and PTO days
5. Click "Get Started"
6. Verify user is created in Supabase Auth

### Sign In Flow
1. Click "Sign In"
2. Enter your email and password
3. Click "Sign In"
4. Verify you're logged in and data is loaded

### Data Persistence
1. Add a trip
2. Add time off dates
3. Update PTO days
4. Sign out and sign back in
5. Verify all data persists

## Troubleshooting

### "Supabase URL or Anon Key is missing"
- Make sure `.env` file exists in root directory
- Verify variables start with `VITE_` prefix
- Restart dev server after changing `.env`

### API Connection Failed
- Check API_BASE_URL is correct
- Verify Edge Function is deployed
- Check browser console for CORS errors

### Database Errors
- Ensure migration SQL was run successfully
- Check Supabase dashboard for table creation
- Verify RLS policies are enabled
