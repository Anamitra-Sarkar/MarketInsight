# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Market Insight application.

## Prerequisites

- A Google account
- Node.js and npm installed

## Steps to Setup Firebase

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "MarketInsight")
4. (Optional) Enable Google Analytics
5. Click "Create project"

### 2. Register Your Web App

1. In your Firebase project, click the **Web** icon (</>) to add a web app
2. Register app with nickname: "Market Insight Web"
3. (Optional) Enable Firebase Hosting
4. Click "Register app"

### 3. Get Firebase Configuration

After registering, you'll see your Firebase configuration. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Enable Authentication Methods

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab

#### Enable Email/Password Authentication:
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

#### Enable Google Authentication:
- Click on "Google"
- Toggle "Enable"
- Select a support email
- Click "Save"

### 5. Setup Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose production mode (or test mode for development)
4. Select a Cloud Firestore location close to your users
5. Click "Enable"

#### Configure Firestore Security Rules

Go to the **Rules** tab and set up the following rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Chat sessions - users can only read/write their own data
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 6. Configure Environment Variables

1. Copy the `.env.example` file in the `frontend` directory:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 7. Run the Application

```bash
# Install dependencies (if not already done)
cd frontend
npm install

# Run in development mode
npm run dev

# Or build for production
npm run build
```

## Features

### User Authentication
- **Email/Password Login**: Users can sign up and login with email and password
- **Google Sign-In**: One-click authentication with Google account
- **Optional Login**: App works without authentication, but login enables chat history

### Chat History
- Logged-in users' conversations are automatically saved to Firestore
- Chat history appears in the left sidebar
- Chats are sorted from newest to oldest
- Each chat shows a preview of the last message and time

## Firestore Data Structure

### Chat Sessions Collection

```javascript
{
  id: "auto-generated-id",
  userId: "user-uid",
  title: "First 100 chars of first message",
  lastMessage: "Last message text",
  timestamp: 1234567890,
  messages: [
    {
      id: "message-id",
      userId: "user-uid",
      message: "User's message",
      timestamp: 1234567890,
      response: "AI response"
    }
  ]
}
```

## Security Notes

1. **Never commit your `.env.local` file** - it's already in `.gitignore`
2. Firebase API keys are safe to expose in client-side code, but configure proper Firestore security rules
3. Always use proper authentication checks in security rules
4. Regularly review Firebase Console for unusual activity

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set correctly in `.env.local`
- Restart the development server after changing environment variables

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Ensure you're logged in when trying to access protected data

### Google Sign-In not working
- Make sure Google authentication is enabled in Firebase Console
- Check if your domain is authorized in Firebase Console

## Support

For issues related to Firebase:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For application-specific issues, please create an issue in the GitHub repository.
