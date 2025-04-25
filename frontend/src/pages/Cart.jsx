import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const { cart, removeFromCart, clearCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate the total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          <p>Your cart is empty. Start shopping now!</p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-purple-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
              >
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={item.imageUrl || item.thumbnail}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <span className="block text-lg font-semibold text-gray-800">{item.name}</span>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-lg px-3 py-1 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation(); // 🛑 prevent triggering navigation
                          updateCartItemQuantity(item.id, 'decrease');
                        }}
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{item.quantity}</span>
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-lg px-3 py-1 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartItemQuantity(item.id, 'increase');
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                  <button
                    className="text-red-500 hover:underline mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center bg-purple-200 p-4 rounded-lg shadow-lg">
            <div className="text-xl font-semibold text-gray-800">Total:</div>
            <div className="text-2xl font-bold text-blue-600">₹{total}</div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
              onClick={() => alert('Proceeding to checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
