import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {app} from '../../firebase/init';

const auth = getAuth(app);

// ✅ Register new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    throw error;
  }
};

// ✅ Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};

// ✅ Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};
