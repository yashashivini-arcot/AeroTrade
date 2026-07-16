import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.items || []);
    } catch { setCartItems([]); }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return false;
    setLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCartItems(data.items || []);
      return true;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCartItems(data.items || []);
    } catch {}
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data.items || []);
    } catch {}
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, loading, fetchCart, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
