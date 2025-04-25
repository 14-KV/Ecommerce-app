// firebaseUtils.js
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// ✅ Add to Wishlist — now accepts full productData
export const addToWishlist = async (user, productId, productData) => {
  if (!user) return;

  const wishlistRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());

  const existingDoc = await getDoc(wishlistRef);
  if (existingDoc.exists()) {
    console.log('ℹ️ Product already in wishlist');
    return;
  }

  await setDoc(wishlistRef, {
    id: productId,
    title: productData.title,
    price: productData.price,
    imageUrl: productData.imageUrl,
    timestamp: new Date(),
  });

  console.log('✅ Product added to wishlist');
};

// ✅ Remove from Wishlist
export const removeFromWishlist = async (user, productId) => {
  if (!user) return;

  const wishlistRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());
  await deleteDoc(wishlistRef);
  console.log('❌ Product removed from wishlist');
};
