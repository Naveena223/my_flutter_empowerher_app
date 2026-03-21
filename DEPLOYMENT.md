# EmpowerHer — Firebase Deployment Guide
**Team: Jeyamalini JN · Nirmal Naveena S · Karthika R**

---

## STEP 1 — Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `empowerher` (or any name you like)
4. Enable/disable Google Analytics (optional)
5. Click **"Create project"**

---

## STEP 2 — Enable Firebase Services

### 2a. Enable Authentication
1. In Firebase Console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable:
   - **Anonymous** → Enable → Save
   - **Email/Password** → Enable → Save

### 2b. Enable Firestore
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in production mode"** (rules are already set)
3. Select your nearest region (e.g. `asia-south1` for India)
4. Click **Done**

### 2c. Enable Hosting
1. In Firebase Console → **Hosting** → **Get started**
2. Follow the prompts (you'll use CLI below)

---

## STEP 3 — Get Your Firebase Config

1. In Firebase Console → **Project Settings** (gear icon)
2. Under **"Your apps"** → click **"</>"** (Web app)
3. Register app name: `EmpowerHer Web`
4. Copy the `firebaseConfig` object — it looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. Open **`firebase.js`** in this project
6. **Replace** the placeholder values with your actual config

---

## STEP 4 — Install Firebase CLI

Open terminal and run:

```bash
npm install -g firebase-tools
```

---

## STEP 5 — Login to Firebase

```bash
firebase login
```
A browser window will open — sign in with your Google account.

---

## STEP 6 — Initialize Firebase in Project Folder

Navigate to your project folder:

```bash
cd path/to/empowerher
firebase init
```

When prompted:
- **Which features?** → Select: `Firestore`, `Hosting` (use Space to select, Enter to confirm)
- **Use existing project?** → Select your `empowerher` project
- **Firestore Rules file?** → Press Enter (use `firestore.rules`)
- **Firestore Indexes file?** → Press Enter (use `firestore.indexes.json`)
- **Public directory?** → Type `.` (just a dot — current directory)
- **Single-page app?** → `N`
- **GitHub auto-deploy?** → `N`
- **Overwrite index.html?** → `N` (IMPORTANT — do NOT overwrite!)

---

## STEP 7 — Deploy

```bash
firebase deploy
```

You'll see output like:
```
✔  Deploy complete!
Hosting URL: https://empowerher-xxxxx.web.app
```

**Your app is live!** 🎉

---

## STEP 8 — Seed Learning Content (Optional)

The app has 6 default topics built in (no Firestore needed).
To add custom topics via Firestore:

1. Firebase Console → **Firestore** → **Start collection**
2. Collection ID: `learning`
3. Add documents with fields:
   - `title` (string): Topic title
   - `content` (string): Full description
   - `icon` (string): An emoji like "📈"
   - `tag` (string): One of `Investing`, `Budgeting`, `Savings`, `Empowerment`, `Safety`

---

## QUICK COMMANDS REFERENCE

```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Preview locally before deploy
firebase serve --only hosting

# View logs
firebase hosting:channel:list
```

---

## FILE STRUCTURE

```
empowerher/
├── index.html          ← Splash screen (entry point)
├── home.html           ← Dashboard
├── learn.html          ← Learning module
├── trade.html          ← Buy/Sell transactions
├── invest.html         ← Investment portfolio
├── expense.html        ← Expense tracker
├── style.css           ← Global design system
├── firebase.js         ← Firebase config ⚠️ Edit this!
├── auth.js             ← Auth helpers
├── db.js               ← Firestore CRUD helpers
├── navbar.js           ← Shared navbar + auth guard
├── firebase.json       ← Hosting + Firestore config
├── firestore.rules     ← Security rules
├── firestore.indexes.json ← Query indexes
└── DEPLOYMENT.md       ← This file
```

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "Firebase App not initialized" | Check `firebase.js` config values |
| "Permission denied" | Check Firestore rules + user is authenticated |
| "Missing index" | Run `firebase deploy --only firestore:indexes` |
| App not loading | Check browser console for errors |
| Anonymous login fails | Enable Anonymous auth in Firebase Console |

---

## WHAT'S INCLUDED

✅ Anonymous authentication (auto on load)  
✅ Email/password registration + login  
✅ Protected routes (all pages require auth)  
✅ Learn module with 6 built-in topics + read tracking  
✅ Buy/Sell transaction tracking with totals  
✅ Investment portfolio with value summary  
✅ Expense tracker with category tags + budget bar  
✅ Dashboard with live stats  
✅ Toast notifications for all actions  
✅ Mobile responsive design  
✅ Firestore security rules  
✅ Firebase Hosting ready  

---

*Built for EmpowerHer — Financial Empowerment for Women*  
*Ideathon Concept | Sales · Learning · Investment*
