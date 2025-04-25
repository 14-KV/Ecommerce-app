import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist } from '../firebase/firebaseUtils';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { user, wishlist, setWishlist } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  const productId = product.id.toString(); // 📌 Always use string for comparison

  // 🔁 Sync local state with global wishlist
  useEffect(() => {
    if (user && Array.isArray(wishlist)) {
      setIsWishlisted(wishlist.includes(productId));
    } else {
      setIsWishlisted(false);
    }
  }, [wishlist, user, productId]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to manage wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(user, productId);
        setWishlist(prev => prev.filter(id => id !== productId));
        setMessageText('Removed from wishlist');
      } else {
        await addToWishlist(user, productId, {
          title: product.title,
          price: product.price,
          imageUrl: product.thumbnail, // or product.image
        });
        
        setWishlist(prev => [...prev, productId]);
        setMessageText('Added to wishlist');
      }

      setIsWishlisted(!isWishlisted);
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 1000);
    } catch (err) {
      console.error('❌ Wishlist error:', err);
    }
  };

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <div className="group relative border rounded-lg p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          {/* ❤️ Wishlist icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 text-red-500 text-xl z-10"
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>

          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
            ₹{product.price}
          </p>
        </div>
      </Link>

      {/* ✅ Success message */}
      {messageVisible && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md z-50 transition-all duration-500">
          {messageText}
        </div>
      )}
    </>
  );
};

export default ProductCard;
