import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for initial load state
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async (uid) => {
    const wishlistRef = collection(db, 'users', uid, 'wishlist');
    const snapshot = await getDocs(wishlistRef);
    const wishlistItems = snapshot.docs.map(doc => doc.id); // 💡 use doc ID (productId)
    setWishlist(wishlistItems);
  };

  // ⛏️ Create Firestore document for new user
  const createUserDocIfNeeded = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: serverTimestamp(),
        });
        console.log("📄 New user document created in Firestore.");
      }
    } catch (err) {
      console.error("❌ Failed to create user doc:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await createUserDocIfNeeded(currentUser);
        setUser(currentUser);
        await fetchWishlist(currentUser.uid); // 📌 Fetch wishlist on login
      } else {
        setUser(null);
        setWishlist([]); // clear wishlist when logged out
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, loading, wishlist, setWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
