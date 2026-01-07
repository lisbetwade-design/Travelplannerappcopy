# Oooff Travel Planner - Setup Instructions

## Overview
Oooff is a travel planning app that helps you organize your time off and plan trips around bank holidays. The app uses Supabase for authentication and data storage.

## Prerequisites

Before you begin, you'll need:
- Node.js (v16 or higher)
- A Supabase account (sign up at https://supabase.com)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for your project to be created (this takes a few minutes)

### 2. Get Your API Keys

1. Go to your project settings (gear icon in the sidebar)
2. Click "API" in the settings menu
3. Copy the following values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key** (This is your SUPABASE_ANON_KEY)

### 3. Set Up Database Tables

1. In your Supabase project, click "SQL Editor" in the sidebar
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20240104_create_tables.sql`
4. Paste into the SQL editor and click "Run"
5. Verify tables were created by clicking "Table Editor" - you should see `users`, `trips`, and `time_off` tables

### 4. Deploy the Edge Function (Backend Server)

The backend API server is located in `supabase/functions/server/`. You need to deploy it as a Supabase Edge Function:

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (you'll need your project reference ID from the URL):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Deploy the function:
   ```bash
   supabase functions deploy server
   ```

5. Your API will be available at:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-fe35748f
   ```

### 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_BASE_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-fe35748f
   ```

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Getting Started

1. Open the app in your browser
2. Create an account:
   - Enter your email and password
   - Select your country (for bank holiday information)
   - Enter your annual PTO days
3. Start planning your trips!

## Features

### Calendar
- View bank holidays for your selected country
- Add time off dates
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

✅ **Secure Authentication**: Uses Supabase Auth with proper password hashing
✅ **Session Management**: JWT tokens are automatically managed and refreshed
✅ **Data Persistence**: All data is stored securely in Supabase PostgreSQL database
✅ **Row Level Security**: Database policies ensure users can only access their own data

## Troubleshooting

### Environment Variables Not Loading
- Make sure your `.env` file is in the root directory
- Restart the development server after changing `.env`
- Vite requires `VITE_` prefix for environment variables

### Sign Up/Sign In Issues
- Check that your Supabase URL and keys are correct
- Verify the Edge Function is deployed and accessible
- Check browser console for detailed error messages

### Database Errors
- Ensure you ran the migration SQL file
- Check that Row Level Security policies are enabled
- Verify your user is authenticated before making data requests

### API Connection Issues
- Verify your API_BASE_URL includes the full path to the Edge Function
- Check that CORS is properly configured in the Edge Function
- Ensure you're passing the Authorization header with API requests

### Sign Out
Click the logout icon (⎋) in the top-right corner to sign out and return to the sign in screen.

## Development

### Database Schema

The app uses three main tables:

1. **users**: Stores user metadata (country, PTO days)
2. **trips**: Stores user trips (destination, dates, budget, activities)
3. **time_off**: Stores individual time off dates

All tables have Row Level Security enabled to protect user data.

### API Endpoints

The backend provides these endpoints:

- `POST /signup` - Create new user account
- `GET /user/data` - Get user data, trips, and time off
- `POST /user/trips` - Save all trips
- `DELETE /user/trips/:tripId` - Delete a specific trip
- `POST /user/timeoff` - Save time off dates
- `PUT /user/metadata` - Update user metadata (PTO days)

## Browser Compatibility
The app works best in modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Security Note
This app uses Supabase Auth for secure authentication. Passwords are properly hashed and stored securely. Session tokens are managed automatically with JWT tokens.
