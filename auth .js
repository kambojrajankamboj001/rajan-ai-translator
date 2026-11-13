
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4jrGIxshHl4Lw8FXI2vUn0G7n4MtMWk0",
  authDomain: "rajan-ai-translator-71739.firebaseapp.com",
  projectId: "rajan-ai-translator-71739",
  storageBucket: "rajan-ai-translator-71739.firebasestorage.app",
  messagingSenderId: "670745367116",
  appId: "1:670745367116:web:847415d683fb8005f2dae9"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

// HTML Elements
const authBox = document.getElementById("authBox");
const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const loginStatus = document.getElementById("loginStatus");

// Check HTML elements
if (!authBox || !loginBtn || !logoutBtn ||
    !userInfo || !userName || !userPhoto || !loginStatus) {
  throw new Error("Login HTML elements missing. Check your element IDs.");
}

// Keep login box visible outside the app content
document.body.prepend(authBox);

// Lock and unlock website content
const pageElements = [...document.body.children].filter(
  element => element !== authBox && element.tagName !== "SCRIPT"
);

function lockWebsite() {
  pageElements.forEach(element => {
    element.hidden = true;
    element.inert = true;
  });

  authBox.style.display = "block";
  loginBtn.style.display = "inline-block";
  userInfo.style.display = "none";
}

function unlockWebsite() {
  pageElements.forEach(element => {
    element.hidden = false;
    element.inert = false;
  });

  loginBtn.style.display = "none";
  userInfo.style.display = "block";
}

// Login
loginBtn.addEventListener("click", async () => {
  loginBtn.disabled = true;
  loginStatus.textContent = "Connecting to Google...";

  try {
    await signInWithPopup(auth, provider);
    loginStatus.textContent = "Login successful!";
  } catch (error) {
    console.error("Firebase Login Error:", error);

    loginStatus.textContent =
      "Login Error: " + error.code;

    loginBtn.disabled = false;
  }
});

// Authentication Status
onAuthStateChanged(auth, (user) => {
  if (user) {
    unlockWebsite();

    userName.textContent =
      "Welcome, " + (user.displayName || "User");

    if (user.photoURL) {
      userPhoto.src = user.photoURL;
      userPhoto.style.display = "inline-block";
    } else {
      userPhoto.style.display = "none";
    }

    loginStatus.textContent = "You are logged in!";
  } else {
    lockWebsite();

    userName.textContent = "";
    userPhoto.src = "";
    userPhoto.style.display = "none";
    loginBtn.disabled = false;

    loginStatus.textContent = "Please login to continue.";
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  logoutBtn.disabled = true;

  try {
    await signOut(auth);
    loginStatus.textContent = "Logged out successfully!";
  } catch (error) {
    console.error("Logout Error:", error);
    loginStatus.textContent = "Logout Error: " + error.code;
  } finally {
    logoutBtn.disabled = false;
  }
});
