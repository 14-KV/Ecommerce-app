import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import { addToWishlist, removeFromWishlist } from '../firebase/firebaseUtils';
import { useAuth } from '../context/AuthContext';

const Product = () => {
  const { id } = useParams();
  const { user, wishlist, setWishlist } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  

  const productId = id.toString();

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // 🔁 Sync wishlist state
  useEffect(() => {
    if (user && Array.isArray(wishlist)) {
      setIsWishlisted(wishlist.includes(productId));
    } else {
      setIsWishlisted(false);
    }
  }, [wishlist, user, productId]);

  const handleAddToCart = () => {
    addToCart(product);
    setMessageText(`${product.title} has been added to your cart!`);
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 3000);
  };

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
        setMessageText(`${product.title} removed from your wishlist!`);
      } else {
        await addToWishlist(user, productId, {
          title: product.title,
          price: product.price,
          imageUrl: product.thumbnail || product.image, // make sure this field exists
        });        
        setWishlist(prev => [...prev, productId]);
        setMessageText(`${product.title} added to your wishlist!`);
      }

      setIsWishlisted(!isWishlisted);
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 3000);
    } catch (err) {
      console.error('❌ Wishlist error:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col md:flex-row items-center gap-10">
      {/* Image */}
      <motion.img
        src={product.thumbnail}
        alt={product.title}
        className="w-full md:w-1/2 max-h-[60vh] object-contain rounded-xl shadow-lg"
        loading="lazy"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Product Info */}
      <motion.div
        className="w-full md:w-1/2 bg-purple-300 rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">{product.title}</h2>
        <p className="text-xl text-blue-600 font-semibold mb-2">₹{product.price}</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          <span>Brand: <strong className="text-gray-700">{product.brand}</strong></span>
          <span>Category: <strong className="capitalize text-gray-700">{product.category}</strong></span>
          <span>Rating: ⭐ {product.rating}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow transition"
          >
            Add to Cart
          </motion.button>

          <motion.button
            onClick={handleWishlistToggle}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className={`${
              isWishlisted ? 'bg-gray-600 hover:bg-gray-700' : 'bg-pink-500 hover:bg-pink-600'
            } text-white py-2 px-6 rounded-lg shadow transition`}
          >
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </motion.button>
        </div>
      </motion.div>

      {/* ✅ Success Message */}
      {messageVisible && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md z-50 transition-all duration-500">
          {messageText}
        </div>
      )}
    </div>
  );
};

export default Product;
