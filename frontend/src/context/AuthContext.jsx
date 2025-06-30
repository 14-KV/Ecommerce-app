import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

import { auth, db } from '../firebase/init';               // keep for onAuthStateChanged + db
import { loginUser, registerUser, logoutUser } from '../services/firebase'; // NEW service imports

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);   // initial splash loader
  const [wishlist, setWishlist] = useState([]);

  /* -------------------------------------------
     Helper: fetch wishlist (ids only for speed)
  ------------------------------------------- */
  const fetchWishlist = async (uid) => {
    const wishlistRef  = collection(db, 'users', uid, 'wishlist');
    const snapshot     = await getDocs(wishlistRef);
    const wishlistIds  = snapshot.docs.map((d) => d.id);
    setWishlist(wishlistIds);
  };

  /* -------------------------------------------
     Helper: create Firestore doc on first login
  ------------------------------------------- */
  const createUserDocIfNeeded = async (firebaseUser) => {
    try {
      const userRef  = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email     : firebaseUser.email,
          createdAt : serverTimestamp(),
        });
        console.log('📄 New user Firestore doc created');
      }
    } catch (err) {
      console.error('❌ createUserDocIfNeeded:', err.message);
    }
  };

  /* -------------------------------------------
     Auth state listener
  ------------------------------------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await createUserDocIfNeeded(currentUser);
        setUser(currentUser);
        await fetchWishlist(currentUser.uid);
      } else {
        setUser(null);
        setWishlist([]);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // cleanup
  }, []);

  /* -------------------------------------------
     Methods exposed to the app
  ------------------------------------------- */
  const signup = (email, password) => registerUser(email, password);
  const login  = (email, password) => loginUser(email, password);
  const logout = () => logoutUser();

  /* -------------------------------------------
     Provider
  ------------------------------------------- */
  const value = { user, loading, login, signup, logout, wishlist, setWishlist };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* Convenience hook */
export const useAuth = () => useContext(AuthContext);
