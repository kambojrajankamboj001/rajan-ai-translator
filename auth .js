import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 👇 YAHAN APNI FIREBASE WALI CHABI DALO 👇
const firebaseConfig = {
  apiKey: "TUMHARI_API_KEY_YAHAN",
  authDomain: "TUMHARA-PROJECT.firebaseapp.com",
  projectId: "TUMHARA-PROJECT-ID",
  appId: "TUMHARA-APP-ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const loginStatus = document.getElementById("loginStatus");

loginBtn.addEventListener("click", async () => {
  loginStatus.textContent = "Google khul raha hai...";
  try {
    const result = await signInWithPopup(auth, provider);
    loginStatus.textContent = "Welcome " + result.user.displayName;
  } catch (error) {
    loginStatus.textContent = "Error: " + error.message;
    alert(error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";
    userName.textContent = user.displayName;
    userPhoto.src = user.photoURL;
  } else {
    loginBtn.style.display = "block";
    userInfo.style.display = "none";
  }
});
