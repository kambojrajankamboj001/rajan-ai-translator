
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// HTML Elements
const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const loginStatus = document.getElementById("loginStatus");

// Google Login
loginBtn.onclick = async () => {
  try {
    loginStatus.textContent = "Opening Google Login...";
    await signInWithPopup(auth, provider);
    loginStatus.textContent = "Login successful!";
  } catch (error) {
    console.error(error);
    loginStatus.textContent = "Login failed: " + error.message;
  }
};

// Check Login Status
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";

    userName.textContent = "Welcome, " + user.displayName;
    userPhoto.src = user.photoURL || "";
  } else {
    loginBtn.style.display = "inline-block";
    userInfo.style.display = "none";
    userName.textContent = "";
    userPhoto.src = "";
  }
});

// Logout
logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
    loginStatus.textContent = "Logged out successfully!";
  } catch (error) {
    loginStatus.textContent = error.message;
  }
};
