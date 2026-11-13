import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4jrGIxshHl4Lw8FXI2vUn0G7n4MtMWk0",
  authDomain: "rajan-ai-translator-71739.firebaseapp.com",
  projectId: "rajan-ai-translator-71739",
  storageBucket: "rajan-ai-translator-71739.firebasestorage.app",
  messagingSenderId: "670745367116",
  appId: "1:670745367116:web:847415d683fb8005f2dae9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Button ko naam se nahi, text se dhoondenge
const loginBtn = document.getElementById("googleLogin") || [...document.querySelectorAll("button")].find(b => b.textContent.includes("Continue with Google"));
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const loginStatus = document.getElementById("loginStatus");

console.log("Login button mila?", !!loginBtn);

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    alert("Google khul raha hai...");
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Welcome " + result.user.displayName);
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
} else {
  alert("Button nahi mila! index.html me button check karo");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userInfo) userInfo.style.display = "block";
    if (userName) userName.textContent = user.displayName;
    if (userPhoto) userPhoto.src = user.photoURL;
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (userInfo) userInfo.style.display = "none";
  }
});
