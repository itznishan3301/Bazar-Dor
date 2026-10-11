import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDExampleKeyHere123456789abcdef",
  authDomain: "bazardor-app.firebaseapp.com",
  projectId: "bazardor-app",
  storageBucket: "bazardor-app.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
