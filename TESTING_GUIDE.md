# Testing Guide for Supabase Integration

## Prerequisites for Testing

Before testing the application, you need to set up a Supabase project:

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com) and sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Choose an organization
   - Enter project name (e.g., "oooff-travel-planner")
   - Create a strong database password
   - Select a region close to you
   - Wait for project setup to complete (2-3 minutes)

3. **Get Your Project Credentials**
   - Go to Project Settings > API
   - Copy the "Project URL" (starts with `https://`)
   - Copy the "anon/public" key (starts with `eyJ`)

4. **Configure the Application**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and paste your credentials:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Run the Database Migration**
   - Open Supabase project dashboard
   - Go to SQL Editor (left sidebar)
   - Click "New Query"
   - Copy and paste the entire contents of `/supabase/migrations/20240104_create_tables.sql`
   - Click "Run" or press Ctrl+Enter
   - You should see "Success. No rows returned" message

## Test Scenarios

### 1. User Registration (Sign Up)

**Steps:**
1. Start the dev server: `npm run dev`
2. Open the app in your browser
3. Click on "Sign Up" tab (should be selected by default)
4. Enter a test email (e.g., `test@example.com`)
5. Enter a password (minimum 6 characters)
6. Click "Continue"
7. Select a country from the dropdown
8. Enter PTO days (e.g., 20)
9. Click "Get Started"

**Expected Result:**
- User should be successfully registered
- App should redirect to the Dashboard
- User email should appear in the top right corner

**Verify in Supabase:**
- Go to Authentication > Users in Supabase dashboard
- You should see the new user listed
- Go to Table Editor > users - the user record should be there
- Confirm country and total_pto_days are correct

### 2. User Authentication (Sign In)

**Steps:**
1. Sign out from the app (click logout icon in top right)
2. Click "Sign In" tab
3. Enter the email and password from previous test
4. Click "Sign In"

**Expected Result:**
- User should be successfully authenticated
- App should load and show Dashboard
- User data should be preserved from sign up

### 3. Trip Management

**Add a Trip:**
1. Sign in to the app
2. Navigate to the calendar or trips section
3. Click "Add Trip" or similar button
4. Enter trip details:
   - Destination
   - Start date
   - End date
   - Budget (optional)
   - Activities (optional)
5. Save the trip

**Expected Result:**
- Trip should appear in the UI
- Trip should persist after page refresh

**Verify in Supabase:**
- Go to Table Editor > trips
- You should see the trip record with correct details

**Delete a Trip:**
1. Find the trip in the UI
2. Click delete/remove button
3. Confirm deletion

**Expected Result:**
- Trip should be removed from UI
- Time off dates associated with the trip should be restored
- Changes should persist after page refresh

### 4. Time Off Management

**Add Time Off:**
1. Navigate to the calendar
2. Add time off dates
3. Save changes

**Expected Result:**
- Time off dates should appear in the calendar
- Changes should persist after page refresh

**Verify in Supabase:**
- Go to Table Editor > time_off
- You should see records for the added dates

**Remove Time Off:**
1. Navigate to settings or time off management
2. Clear/remove all time off dates
3. Confirm changes

**Expected Result:**
- Time off dates should be cleared
- Changes should persist after page refresh

### 5. PTO Days Update

**Steps:**
1. Navigate to settings
2. Update the total PTO days value
3. Save changes

**Expected Result:**
- New PTO value should be displayed
- Changes should persist after page refresh

**Verify in Supabase:**
- Go to Table Editor > users
- The total_pto_days field should reflect the new value

### 6. Session Persistence

**Steps:**
1. Sign in to the app
2. Add some data (trips, time off)
3. Close the browser completely
4. Reopen the browser and navigate to the app

**Expected Result:**
- User should still be signed in (session persisted)
- All data should be loaded correctly

### 7. Multiple Users

**Steps:**
1. Sign out from current user
2. Sign up with a different email
3. Add some trips and time off
4. Sign out
5. Sign in with the first user account

**Expected Result:**
- Each user should see only their own data
- Data should not mix between users
- Row Level Security should enforce proper data isolation

## Common Issues and Solutions

### Issue: "relation does not exist" error
**Solution:** Make sure you've run the migration SQL script in Supabase SQL Editor

### Issue: "Invalid API key" or connection errors
**Solution:** 
- Verify your `.env` file has correct credentials
- Make sure you're using the "anon/public" key, not the service role key
- Restart the dev server after changing `.env`

### Issue: Sign up works but data not saved
**Solution:**
- Check Supabase logs in Dashboard > Logs
- Verify RLS policies are enabled
- Check browser console for errors

### Issue: Can't sign in after sign up
**Solution:**
- Check if email confirmation is required in Supabase Auth settings
- Go to Authentication > Settings > Email Auth
- Disable "Enable email confirmations" for testing

## Debugging Tips

1. **Browser Console**: Always check browser console (F12) for JavaScript errors

2. **Supabase Logs**: 
   - Go to Supabase Dashboard > Logs
   - Select "Postgres" or "Auth" to see relevant logs

3. **Network Tab**: 
   - Open browser DevTools > Network
   - Filter by "Fetch/XHR"
   - Check API calls to Supabase

4. **Database Direct Query**:
   - Use SQL Editor in Supabase to query tables directly
   - Example: `SELECT * FROM users;`
   - Example: `SELECT * FROM trips WHERE user_id = 'your-user-id';`

## Security Verification

1. **Test RLS Policies**:
   - Sign in as User A
   - Note User A's data
   - Sign out and sign in as User B
   - Verify User B cannot see User A's data

2. **Check Auth Tokens**:
   - Open browser DevTools > Application > Local Storage
   - Look for Supabase auth tokens
   - Tokens should be automatically managed

## Performance Considerations

- Initial load should take < 2 seconds
- Auth operations should complete within 1-2 seconds
- Database queries should be fast (< 500ms)
- Use browser DevTools > Performance to profile

## Next Steps After Testing

If all tests pass:
1. ✅ Supabase integration is complete
2. ✅ Authentication is working
3. ✅ Data persistence is functional
4. ✅ Security policies are enforced

You can now:
- Deploy to production
- Add more features
- Customize the UI
- Add email templates in Supabase Auth settings
