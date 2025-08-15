'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  "projectId": "your-profession-touch",
  "appId": "1:811982079255:web:c45a52957a43c681dda352",
  "storageBucket": "your-profession-touch.firebasestorage.app",
  "apiKey": "AIzaSyAGS8ZPztPQk1InzGvGzfTLwh5fxKPtATM",
  "authDomain": "your-profession-touch.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "811982079255"
};


// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

export { app };
