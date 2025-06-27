import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCM_5PQICIlyDuXeUOzSL461321bICOJRE",
  authDomain: "blogsphere-6a151.firebaseapp.com",
  projectId: "blogsphere-6a151",
  storageBucket: "blogsphere-6a151.firebasestorage.app",
  messagingSenderId: "5323836655",
  appId: "1:5323836655:web:f577185a2a89c5c2805f1a",
  measurementId: "G-TK2567R7EM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Create admin account if it doesn't exist
const createAdminAccount = async () => {
  try {
    await createUserWithEmailAndPassword(auth, 'ayush145@gmail.com', 'ilovebooks');
  } catch (error) {
    // Account might already exist, which is fine
    console.log('Admin account setup completed');
  }
};

createAdminAccount();