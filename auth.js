import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
window.currentUser = null;

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const loginStatus = document.getElementById("loginStatus");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    if (loginStatus) loginStatus.textContent = "Google khul raha hai...";
    try {
      const result = await signInWithPopup(auth, provider);
      if (loginStatus) loginStatus.textContent = "Welcome " + result.user.displayName;
    } catch (error) {
      if (loginStatus) loginStatus.textContent = "Error: " + error.message;
      alert(error.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  window.currentUser = user;
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

// Ye function search save karega
window.saveSearch = async function(input, output, from, to) {
  try {
    await addDoc(collection(db, "search_history"), {
      name: window.currentUser ? window.currentUser.displayName : "Without Login",
      email: window.currentUser ? window.currentUser.email : "No Email",
      inputText: input,
      outputText: output,
      fromLang: from,
      toLang: to,
      time: new Date().toString()
    });
  } catch (e) {
    console.log("Save error", e);
  }
};
