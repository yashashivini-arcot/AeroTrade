import Wishlist from '../models/Wishlist.js';

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const list = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(list || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/wishlist/:productId
export const addToWishlist = async (req, res) => {
  try {
    let list = await Wishlist.findOne({ user: req.user._id });
    if (!list) list = new Wishlist({ user: req.user._id, products: [] });

    if (!list.products.includes(req.params.productId)) {
      list.products.push(req.params.productId);
      await list.save();
    }
    await list.populate('products');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const list = await Wishlist.findOne({ user: req.user._id });
    if (!list) return res.status(404).json({ message: 'Wishlist not found' });
    list.products = list.products.filter((p) => p.toString() !== req.params.productId);
    await list.save();
    await list.populate('products');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
