// auth.js — Authentication helpers for EmpowerHer
import { auth } from "./firebase.js";
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Check auth state — called on every page load
export function checkAuth(redirectIfLoggedOut = true) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        // Auto sign-in anonymously
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (err) {
          console.error("Anonymous sign-in failed:", err);
          if (redirectIfLoggedOut) window.location.href = "index.html";
        }
      }
    });
  });
}

// Email/password registration
export async function registerWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Email/password login
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Logout
export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}
