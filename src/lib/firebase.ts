import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAGS8ZPztPQk1InzGvGzfTLwh5fxKPtATM",
  authDomain: "your-profession-touch.firebaseapp.com",
  projectId: "your-profession-touch",
  storageBucket: "your-profession-touch.appspot.com",
  messagingSenderId: "811982079255",
  appId: "1:811982079255:web:f32942bb936dca08dda352"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
