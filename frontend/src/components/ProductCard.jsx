import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductCard({ product, onToast }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const salePrice = product.price * (1 - (product.discount || 0) / 100);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product._id, 1);
      onToast?.(`Added to bag: ${product.name}`);
    } catch { onToast?.('Could not add to cart'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    await toggleWishlist(product._id);
    onToast?.(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__image-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1585386959858-dc8c6e8d0d16?w=600&q=80'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        <div className="product-card__badges">
          {product.state && <span className="product-card__badge product-card__badge--state">📍 {product.state}</span>}
          {product.isSustainable && <span className="product-card__badge product-card__badge--eco">🌿 Eco</span>}
          {product.discount > 0 && <span className="product-card__badge product-card__badge--sale">-{product.discount}%</span>}
        </div>
        <div className="product-card__overlay">
          <Link to={`/product/${product._id}`} className="product-card__overlay-btn" title="Quick View">
            <FiEye />
          </Link>
        </div>
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__brand">{product.brand}</span>
          {product.craftType && <span className="product-card__craft">{product.craftType}</span>}
        </div>

        <Link to={`/product/${product._id}`} className="product-card__name">{product.name}</Link>

        <div className="product-card__rating">
          <FiStar className="product-card__star" />
          <span>{(product.rating || 0).toFixed(1)}</span>
          <span className="product-card__reviews">({product.numReviews || 0})</span>
          {product.isMSME && <span className="product-card__msme">👥 MSME</span>}
        </div>

        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="product-card__price">₹{Math.round(salePrice).toLocaleString('en-IN')}</span>
            {product.discount > 0 && (
              <span className="product-card__original">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="product-card__actions">
            <button
              className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
              onClick={handleWishlist}
              aria-label="Wishlist"
            >
              <FiHeart />
            </button>
            <button
              className="product-card__cart-btn"
              onClick={handleAddToCart}
              disabled={!product.stock}
              aria-label="Add to cart"
            >
              <FiShoppingBag />
              {product.stock ? 'Add' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
