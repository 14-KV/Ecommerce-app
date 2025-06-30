import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/init';

// ✅ Add product to wishlist
export const addToWishlist = async (user, productId, productData) => {
  if (!user) return;

  try {
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
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error.message);
  }
};

// ✅ Remove product from wishlist
export const removeFromWishlist = async (user, productId) => {
  if (!user) return;

  try {
    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());
    await deleteDoc(wishlistRef);
    console.log('❌ Product removed from wishlist');
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error.message);
  }
};
