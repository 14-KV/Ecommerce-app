import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Auth/Login';
import Category from './pages/Category'; // ✅ New import
import SignUp from './pages/Auth/SignUp';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Orders from "./pages/Orders"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} /> {/* ✅ New Route */}
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
