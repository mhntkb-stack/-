import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// The app is now initialized in src/lib/firebase.ts to be used across the application
// const app = initializeApp(firebaseConfig);
const app = {}; // This is a placeholder now
const database = getDatabase(app as any);

// --- Writing Data ---

// Simple write
function writeUserData(userId: string, name: string, email: string, imageUrl: string) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

// Adding a new item to a list (generating a unique key)
function writeNewPost(userId: string, title: string, body: string) {
  const postListRef = ref(database, 'posts');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    author: userId,
    title: title,
    body: body,
    timestamp: Date.now()
  });
}

// --- Reading Data ---

// Reading data once
function readOnce(userId: string) {
  const userRef = ref(database, 'users/' + userId);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log("User data:", data);
  }, {
    onlyOnce: true // Read data only once
  });
}

// Reading data in real-time
function readRealtime(userId: string) {
  const userRef = ref(database, 'users/' + userId);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log("User data (real-time):", data);
  });
}
