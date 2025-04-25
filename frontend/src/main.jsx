import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';  // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ wrap AuthProvider first */}
      <CartProvider> {/* ✅ then CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
