import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const WishlistCard = ({ item }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [messageText, setMessageText] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please Log in");
      return;
    }

    addToCart(item); // Directly using item (no need to fetch product again)
    setMessageText(`${item.title} has been added to your cart!`);
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 1000);
  };

  const handleCardClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="cursor-pointer group relative border rounded-lg p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
          ₹{item.price}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-3 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
        >
          Add to Cart
        </button>
      </div>

      {messageVisible && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md z-50 transition-all duration-500">
          {messageText}
        </div>
      )}
    </>
  );
};

export default WishlistCard;
