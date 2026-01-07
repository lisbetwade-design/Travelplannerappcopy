# Oooff Travel Planner - Setup Instructions

## Overview
Oooff is a travel planning app that helps you organize your time off and plan trips around bank holidays. The app uses localStorage to store multiple user accounts and their data locally in your browser.

## Getting Started

1. Open the app in your browser
2. Create an account or sign in:
   - **Sign Up**: Enter email and password, then select your country and PTO days
   - **Sign In**: Enter your existing email and password
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

## User Accounts

The app supports multiple user accounts, all stored locally in your browser:
- Each account has its own email/password
- User data includes: country, PTO days, time off dates, and trips
- Switch between accounts by signing out and signing in with different credentials

**Important Notes:**
- Passwords are stored in plain text in localStorage (for demo purposes only)
- Data is specific to your browser and device
- Clearing browser data will delete all accounts
- This is a demo app - do not use real passwords

## Data Storage

All data is stored in localStorage:
- `oooff_users`: Contains all user accounts and their data
- `oooff_current_user`: Tracks the currently signed-in user

## Troubleshooting

### Data Not Saving
- Ensure your browser allows localStorage
- Check that you're not in private/incognito mode
- Some browsers may block localStorage - try a different browser

### Sign In Issues
- Make sure you're using the correct email and password
- Account emails are case-sensitive
- If you forgot your password, you'll need to clear browser data and create a new account

### Sign Out
Click the logout icon (⎋) in the top-right corner to sign out and return to the sign in screen.

### Reset All Data
To completely reset the app and delete all accounts:
1. Open browser DevTools (F12)
2. Go to the Console tab
3. Run: `localStorage.clear()`
4. Refresh the page

## Browser Compatibility
The app works best in modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Security Note
This app stores passwords in plain text for demonstration purposes. In a production app, passwords should be properly hashed and stored securely on a backend server. Never use your real passwords in this demo app.
