// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOrdersClick = () => {
    if (user) {
      navigate('/orders');
    } else {
      navigate('/login');
      // Optional: Add toast/snackbar for "Please log in to view your orders"
    }
  };

  return (
    <nav className="bg-purple-300 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-800 transition">
        Apni Dukaan 🛍️
      </Link>

      <div className="flex gap-4 items-center">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-800 transition"
        >
          Home
        </Link>

        <button
          onClick={handleOrdersClick}
          className="text-gray-700 hover:text-blue-800 transition"
        >
          Orders
        </button>

        <Link
          to="/cart"
          className="relative flex items-center gap-2 text-gray-700 hover:text-blue-800 transition font-medium"
        >
          <div className="relative">
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                {cart.length}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Cart</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">👤 {user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
