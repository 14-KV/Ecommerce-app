// context/CartContext.jsx
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/init'; // adjust to your path
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return setCart([]);
      const cartRef = collection(db, 'users', user.uid, 'cart');
      const snapshot = await getDocs(cartRef);
      const cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCart(cartItems);
    };
    fetchCart();
  }, [user]);

  // Helper to save item to Firestore
  const saveToFirestore = async (item) => {
    if (!user) return;
    const itemRef = doc(db, 'users', user.uid, 'cart', item.id.toString());
    await setDoc(itemRef, item);
  };

  const deleteFromFirestore = async (productId) => {
    if (!user) return;
    const itemRef = doc(db, 'users', user.uid, 'cart', productId.toString());
    await deleteDoc(itemRef);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    saveToFirestore(existing ? { ...existing, quantity: existing.quantity + 1 } : { ...product, quantity: 1 });
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    deleteFromFirestore(productId);
  };

  const updateCartItemQuantity = (productId, action) => {
    const updatedCart = cart.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: action === 'increase'
              ? item.quantity + 1
              : item.quantity > 1
                ? item.quantity - 1
                : item.quantity
          }
        : item
    );

    setCart(updatedCart);
    const updatedItem = updatedCart.find(item => item.id === productId);
    if (updatedItem) saveToFirestore(updatedItem);
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      const cartRef = collection(db, 'users', user.uid, 'cart');
      const snapshot = await getDocs(cartRef);
      const deletions = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletions);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
