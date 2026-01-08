# Oooff Travel Planner - Setup Instructions

## Overview
Oooff is a travel planning app that helps you organize your time off and plan trips around bank holidays. The app uses Supabase for authentication and data storage.

## Prerequisites

- Node.js (v16 or higher)
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Project

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon/public key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Run Database Migrations

Run the SQL migration script to create the necessary database tables:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open and run the migration file: `/supabase/migrations/20240104_create_tables.sql`

This will create:
- `users` table for user profile data
- `trips` table for storing trip information
- `time_off` table for tracking PTO/vacation days
- Row Level Security (RLS) policies for secure data access

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Features

### Authentication
- Secure sign up and sign in with email/password
- Session management with automatic token refresh
- Secure password storage (hashed by Supabase Auth)

### Calendar
- View bank holidays for your selected country
- Add and manage time off dates
- Create and manage trips
- See all your planned vacation days in one place

### AI Itinerary Builder
- Generate personalized travel itineraries
- Customize based on your interests and budget

### Upcoming Trips
- View all your planned trips
- Delete trips to restore vacation days

### Last-Minute Deals
- Discover spontaneous travel opportunities

## Authentication & Data Security

The app supports secure user authentication:
- Each account has a unique email/password
- User data includes: country, PTO days, time off dates, and trips
- All data is securely stored in Supabase
- Row Level Security ensures users can only access their own data

## Data Storage

All data is stored securely in Supabase:
- User authentication is handled by Supabase Auth
- User profiles are stored in the `users` table
- Trips are stored in the `trips` table
- Time off dates are stored in the `time_off` table

### Sign Up/Sign In Issues
- Check that your Supabase URL and keys are correct
- Verify the Edge Function is deployed and accessible
- Check browser console for detailed error messages

### Connection Issues
- Ensure your `.env` file has the correct Supabase credentials
- Check that your Supabase project is active
- Verify your network connection

### Database Errors
- Make sure you've run the migration script
- Check Supabase dashboard for error logs
- Verify Row Level Security policies are enabled

### Sign In/Sign Up Issues
- Check the browser console for error messages
- Ensure email format is valid
- Password must be at least 6 characters long
- Check Supabase Auth logs in your project dashboard

### Sign Out
Click the logout icon (⎋) in the top-right corner to sign out.

## Security

This app implements proper security practices:
- Passwords are securely hashed by Supabase Auth
- Row Level Security (RLS) protects user data
- JWT tokens are used for authentication
- All API requests are authenticated

## Browser Compatibility

The app works best in modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

### Backend API (Optional)

The app includes a Deno-based backend API in `/supabase/functions/server/` that can be deployed as a Supabase Edge Function. This is optional as the frontend can communicate directly with Supabase.

To deploy the Edge Function:
```bash
supabase functions deploy server
```

## Support

For issues or questions, please check:
- Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Project repository issues

