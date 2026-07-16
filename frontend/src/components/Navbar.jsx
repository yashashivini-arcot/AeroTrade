import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiLogOut, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const NAV_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/shop' },
    { label: 'New Arrivals', path: '/shop?sort=newest' },
    { label: 'About', path: '/' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">🪔</span>
          <div className="navbar__brand-text">
            <span className="navbar__brand-primary">ShopEZ</span>
            <span className="navbar__brand-sub">Swadeshi</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Search */}
          <form onSubmit={handleSearch} className="navbar__search">
            <FiSearch className="navbar__search-icon" />
            <input
              type="text"
              placeholder="Search crafts, brands, states…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
          </form>

          {/* Wishlist */}
          <Link to={user ? '/wishlist' : '/login'} className="navbar__icon-btn" aria-label="Wishlist">
            <FiHeart />
            {wishlistIds.length > 0 && <span className="navbar__badge">{wishlistIds.length}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
            <FiShoppingBag />
            {cartCount > 0 && <span className="navbar__badge navbar__badge--cart">{cartCount}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="navbar__user-menu" ref={userMenuRef}>
              <button
                className="navbar__user-btn"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="User menu"
              >
                <FiUser />
                <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
              </button>
              {userMenuOpen && (
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiUser /> My Profile
                  </Link>
                  <Link to="/orders" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiSettings /> My Orders
                  </Link>
                  <Link to="/wishlist" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiHeart /> Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin" onClick={() => setUserMenuOpen(false)}>
                      <FiSettings /> Admin Panel
                    </Link>
                  )}
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__login-btn">Login</Link>
          )}

          {/* Mobile hamburger */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
