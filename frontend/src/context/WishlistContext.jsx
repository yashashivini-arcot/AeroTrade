import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistIds([]); return; }
    try {
      const { data } = await api.get('/wishlist');
      setWishlistIds((data.products || []).map((p) => p._id || p));
    } catch { setWishlistIds([]); }
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    try {
      if (wishlistIds.includes(productId)) {
        await api.delete(`/wishlist/${productId}`);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await api.post(`/wishlist/${productId}`);
        setWishlistIds((prev) => [...prev, productId]);
      }
      return true;
    } catch { return false; }
  };

  const isWishlisted = (id) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlistIds, fetchWishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
