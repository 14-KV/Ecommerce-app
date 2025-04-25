import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import WishlistCard from "../components/WishlistCard";



const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wishlist");
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setLoading(true);
      Promise.all([fetchWishlist(), fetchOrders()]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchWishlist = async () => {
    const snapshot = await getDocs(collection(db, "users", user.uid, "wishlist"));
    setWishlist(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "users", user.uid, "orders"));
    setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-center text-lg text-gray-500">Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Account</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`px-4 py-2 rounded ${
            activeTab === "wishlist" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Orders
        </button>
      </div>

      {activeTab === "wishlist" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Wishlist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">No wishlist items yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlist.map(item => (
                  <WishlistCard key={item.id} item={item} />
                ))}
              </div> 
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Orders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orders.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">No orders found.</p>
            ) : (
              orders.map(item => <ItemCard key={item.id} {...item} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
