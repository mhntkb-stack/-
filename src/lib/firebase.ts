import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// !! महत्वपूर्ण !!
// فضلاً، استبدل هذا الكائن بإعدادات مشروع Firebase الخاص بك.
// يمكنك العثور عليها في لوحة تحكم Firebase > إعدادات المشروع.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

export { app };
