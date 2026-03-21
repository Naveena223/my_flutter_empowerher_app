// navbar.js — Injects navbar and handles auth guard for all pages
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function initPage(onUserReady) {
  injectNavbar();
  injectToastContainer();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // No active session → send back to login screen
      window.location.href = "index.html";
    } else {
      updateNavbarUser(user);
      if (onUserReady) onUserReady(user);
    }
  });
}

function injectNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <a href="home.html" class="navbar-brand">
      <span class="brand-icon">💎</span>
      <div>
        <span class="brand-name">EmpowerHer</span>
        <span class="brand-sub">Financial Empowerment</span>
      </div>
    </a>
    <div class="navbar-actions">
      <span class="navbar-user" id="navbarUser"></span>
      <button class="btn btn-outline" id="logoutBtn" onclick="window.__logout()">Sign Out</button>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);
}

function injectToastContainer() {
  if (!document.getElementById("toast-container")) {
    const tc = document.createElement("div");
    tc.id = "toast-container";
    document.body.appendChild(tc);
  }
}

function updateNavbarUser(user) {
  const el = document.getElementById("navbarUser");
  if (el) {
    el.textContent = user.isAnonymous ? "Guest" : (user.email || "User");
  }
}

// Sign Out → always returns to login screen
window.__logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

export function showToast(msg, type = "info") {
  const t = document.createElement("div");
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.getElementById("toast-container").appendChild(t);
  setTimeout(() => {
    t.style.animation = "fadeOut 0.4s forwards";
    setTimeout(() => t.remove(), 400);
  }, 3500);
}
