import { useState, useEffect } from 'react';

// --- Heritage Inline SVG Decorators and Icons ---
const WarliCorner = ({ position = 'top-left' }) => {
  const rotation = {
    'top-left': 'rotate(0)',
    'top-right': 'rotate(90deg)',
    'bottom-left': 'rotate(270deg)',
    'bottom-right': 'rotate(180deg)'
  }[position];

  return (
    <svg 
      viewBox="0 0 100 100" 
      width="60" 
      height="60" 
      style={{ 
        position: 'absolute', 
        opacity: 0.15,
        pointerEvents: 'none',
        transform: rotation,
        top: position.includes('top') ? '10px' : 'auto',
        bottom: position.includes('bottom') ? '10px' : 'auto',
        left: position.includes('left') ? '10px' : 'auto',
        right: position.includes('right') ? '10px' : 'auto',
        color: 'var(--color-primary-accent)'
      }}
    >
      <path d="M10,10 L40,10 L10,40 Z" fill="currentColor" />
      <circle cx="25" cy="25" r="5" fill="var(--color-secondary-accent)" />
      <line x1="10" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="10" x2="10" y2="60" stroke="currentColor" strokeWidth="2" />
      <path d="M50,15 L60,25 L50,35 Z" fill="currentColor" />
    </svg>
  );
};

const KolamDivider = () => (
  <div className="kolam-divider-container">
    <svg viewBox="0 0 200 40" width="160" height="32" className="kolam-svg">
      <path 
        d="M20,20 Q40,5 60,20 T100,20 T140,20 T180,20 M20,20 Q40,35 60,20 T100,20 T140,20 T180,20" 
        fill="none" 
        stroke="var(--color-secondary-accent)" 
        strokeWidth="1.5" 
      />
      <circle cx="60" cy="20" r="3" fill="var(--color-primary-accent)" />
      <circle cx="100" cy="20" r="3" fill="var(--color-primary-accent)" />
      <circle cx="140" cy="20" r="3" fill="var(--color-primary-accent)" />
    </svg>
  </div>
);

// --- Product SVG Illustrations ---
const SareeIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="maroonGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B1E24" />
        <stop offset="70%" stopColor="#9B2830" />
        <stop offset="100%" stopColor="#C89B3C" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="16" fill="url(#maroonGoldGrad)" opacity="0.05" />
    <path d="M40,50 C70,30 130,30 160,50 L160,150 C130,170 70,170 40,150 Z" fill="url(#maroonGoldGrad)" />
    <path d="M40,50 C70,30 130,30 160,50" fill="none" stroke="#C89B3C" strokeWidth="8" />
    <path d="M40,150 C70,170 130,170 160,150" fill="none" stroke="#C89B3C" strokeWidth="8" />
    <circle cx="100" cy="100" r="24" fill="none" stroke="#C89B3C" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="100" cy="100" r="12" fill="none" stroke="#C89B3C" strokeWidth="1.5" />
    <path d="M100,70 L100,130 M70,100 L130,100" stroke="#C89B3C" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

const VaseIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" rx="16" fill="#1E5C8A" opacity="0.05" />
    <path d="M80,40 L120,40 L130,60 C130,60 160,110 140,150 C120,180 80,180 60,150 C40,110 70,60 70,60 Z" fill="#FAF7F2" stroke="#1E5C8A" strokeWidth="4" />
    <circle cx="100" cy="115" r="16" fill="none" stroke="#1E5C8A" strokeWidth="2" />
    <circle cx="100" cy="115" r="6" fill="#C89B3C" />
    <path d="M85,115 C85,95 115,95 115,115 C115,135 85,135 85,115" fill="none" stroke="#1E5C8A" strokeWidth="1.5" />
    <path d="M100,90 Q110,75 100,60 Q90,75 100,90" fill="#1E5C8A" />
    <line x1="82" y1="50" x2="118" y2="50" stroke="#C89B3C" strokeWidth="3" />
    <line x1="68" y1="155" x2="132" y2="155" stroke="#C89B3C" strokeWidth="3" />
  </svg>
);

const CreamIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" rx="16" fill="#2E6F40" opacity="0.05" />
    <rect x="60" y="70" width="80" height="80" rx="10" fill="#FAF7F2" stroke="#2E6F40" strokeWidth="4" />
    <rect x="52" y="50" width="96" height="20" rx="4" fill="#C89B3C" />
    <line x1="52" y1="60" x2="148" y2="60" stroke="#FAF7F2" strokeWidth="1" />
    <path d="M100,90 C115,90 120,110 100,125 C80,110 85,90 100,90 Z" fill="#2E6F40" opacity="0.8" />
    <line x1="100" y1="90" x2="100" y2="125" stroke="#FAF7F2" strokeWidth="1.5" />
    <text x="100" y="140" fill="#2E6F40" fontSize="10" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="1">ELADI</text>
  </svg>
);

const HorseIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" rx="16" fill="#8B5A2B" opacity="0.05" />
    <path 
      d="M50,150 L60,110 L90,110 L150,110 L155,150 M60,110 L65,70 L55,40 L70,30 L80,50 L85,70 L90,110" 
      fill="none" 
      stroke="#C89B3C" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path d="M90,110 C100,95 140,95 150,110" fill="none" stroke="#C89B3C" strokeWidth="2.5" strokeDasharray="2 2" />
    <path d="M60,130 L62,150 M148,130 L150,150" stroke="#C89B3C" strokeWidth="4" strokeLinecap="round" />
    <path d="M95,110 L125,110 L120,125 L100,125 Z" fill="#7B1E24" />
  </svg>
);

const RugIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" rx="16" fill="#C65D3A" opacity="0.05" />
    <rect x="40" y="40" width="120" height="120" rx="4" fill="#EADBC8" stroke="#7A726A" strokeWidth="2" />
    <rect x="50" y="50" width="100" height="100" fill="none" stroke="#C65D3A" strokeWidth="3" />
    <circle cx="100" cy="100" r="20" fill="none" stroke="#7B1E24" strokeWidth="2" />
    <polygon points="100,85 105,95 115,100 105,105 100,115 95,105 85,100 95,95" fill="#C89B3C" />
    <path d="M40,30 L40,40 M60,30 L60,40 M80,30 L80,40 M100,30 L100,40 M120,30 L120,40 M140,30 L140,40 M160,30 L160,40" stroke="#7A726A" strokeWidth="3" />
    <path d="M40,160 L40,170 M60,160 L60,170 M80,160 L80,170 M100,160 L100,170 M120,160 L120,170 M140,160 L140,170 M160,160 L160,170" stroke="#7A726A" strokeWidth="3" />
  </svg>
);

const SpicesIllustration = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" rx="16" fill="#8B4513" opacity="0.05" />
    <rect x="40" y="40" width="120" height="120" rx="6" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="4" />
    <line x1="80" y1="40" x2="80" y2="160" stroke="#5C3A21" strokeWidth="3" />
    <line x1="120" y1="40" x2="120" y2="160" stroke="#5C3A21" strokeWidth="3" />
    <line x1="40" y1="80" x2="160" y2="80" stroke="#5C3A21" strokeWidth="3" />
    <line x1="40" y1="120" x2="160" y2="120" stroke="#5C3A21" strokeWidth="3" />
    <circle cx="60" cy="60" r="12" fill="#C65D3A" />
    <circle cx="100" cy="60" r="12" fill="#C89B3C" />
    <circle cx="140" cy="60" r="12" fill="#2E6F40" />
    <circle cx="60" cy="100" r="12" fill="#D2B48C" />
    <circle cx="100" cy="100" r="12" fill="#8B7355" />
    <circle cx="140" cy="100" r="12" fill="#3D2B1F" />
  </svg>
);

// --- Product Data List ---
const PRODUCTS_DATA = [
  {
    id: 'p1',
    name: 'Hand-Block Printed Chanderi Saree',
    brand: 'Taneira',
    price: 4200,
    rating: 4.8,
    category: 'Fashion',
    state: 'Madhya Pradesh',
    craftType: 'Chanderi Weaving',
    isSustainable: true,
    isMSME: true,
    illustration: <SareeIllustration />,
    history: 'Chanderi sarees are produced by weaving silk and golden zari in traditional cotton yarn. The craft originated in the Vedic period and was patronized by Mughal royalty, creating lightweight, sheer fabrics with soft textures.',
    materials: 'Sustainably sourced organic silk, premium cotton yarn, and pure metallic zari embroidery.',
    artisan: 'Bunkaar Society (MSME), Chanderi'
  },
  {
    id: 'p2',
    name: 'Blue Pottery Floral Vase',
    brand: 'Jaipur Claycrafts',
    price: 1850,
    rating: 4.9,
    category: 'Handicrafts',
    state: 'Rajasthan',
    craftType: 'Blue Pottery',
    isSustainable: true,
    isMSME: true,
    illustration: <VaseIllustration />,
    history: 'Jaipur Blue Pottery is unique because it is the only pottery craft in the world that does not use clay. It is made from a special dough comprising quartz stone powder, powdered glass, and gum, decorated with natural dyes.',
    materials: 'Quartz powder, glass grit, organic gums, cobalt oxide blue glaze.',
    artisan: 'Ram Swaroop Pottery Artisan Cluster, Sanganer'
  },
  {
    id: 'p3',
    name: 'Eladi Hydrating Ayurvedic Facial Cream',
    brand: 'Forest Essentials',
    price: 2450,
    rating: 4.7,
    category: 'Ayurveda',
    state: 'Kerala',
    craftType: 'Ayurvedic Formulation',
    isSustainable: true,
    isMSME: false,
    illustration: <CreamIllustration />,
    history: 'Based on the ancient texts of Ashtanga Hridaya, the Eladi oil formulation incorporates pearl powder, cardamom, and pure saffron threads to deeply moisturize skin and bestow a warm, natural golden glow.',
    materials: '100% natural cold-pressed coconut oil, saffron extract, cardamom, pearl powder.',
    artisan: 'Forest Essentials Heritage Labs'
  },
  {
    id: 'p4',
    name: 'Dhokra Metal Casting Horse Statue',
    brand: 'Bastar Tribal Art',
    price: 3100,
    rating: 4.9,
    category: 'Handicrafts',
    state: 'Chhattisgarh',
    craftType: 'Dhokra Casting',
    isSustainable: true,
    isMSME: true,
    illustration: <HorseIllustration />,
    history: 'Dhokra is a non-ferrous metal casting technique using the lost-wax casting method. This ancient craft has been used in India for over 4,000 years, dating back to the Dancing Girl of Mohenjo-daro.',
    materials: 'Recycled brass metal sheets, local beeswax, and alluvial riverbed clay.',
    artisan: 'Bastar Dhokra Shilp Kala Cluster'
  },
  {
    id: 'p5',
    name: 'Handwoven Natural Jute Rug',
    brand: 'EcoWeave India',
    price: 5400,
    rating: 4.6,
    category: 'Home Decor',
    state: 'West Bengal',
    craftType: 'Jute Weaving',
    isSustainable: true,
    isMSME: true,
    illustration: <RugIllustration />,
    history: 'West Bengal is the global capital of Jute, also known as the Golden Fiber. Artisans braid long stalks of coarse jute fiber by hand and weave them into durable, heavy-duty mats and carpets using traditional wooden frame looms.',
    materials: '100% biodegradable organic jute fibers and natural vegetable dyes.',
    artisan: 'Howrah Weaving Self Help Group (SHG)'
  },
  {
    id: 'p6',
    name: 'Teak Wood Spice Masala Box',
    brand: 'Rasoi Crafts',
    price: 1250,
    rating: 4.8,
    category: 'Kitchen',
    state: 'Karnataka',
    craftType: 'Wood Carving',
    isSustainable: true,
    isMSME: true,
    illustration: <SpicesIllustration />,
    history: 'Handcrafted by generational woodcarvers in Karnataka. Teak wood boxes are naturally insect-resistant and durable. Polished with natural lac-dye to preserve spices without chemical contamination.',
    materials: 'Sustainably harvested aged teak wood, organic shellac finish, brass clasp.',
    artisan: 'Channapatna Heritage Woodcraft Group'
  }
];

// --- Mock Registered Users for Admin View Simulator ---
const MOCK_REGISTERED_USERS = [
  { id: 'usr_001', name: 'Priyasree Sen', email: 'priya.sen@heritage.in', role: 'USER', created: '2026-05-12' },
  { id: 'usr_002', name: 'Rajesh Patel', email: 'rajesh@patelcrafts.com', role: 'USER', created: '2026-06-01' },
  { id: 'usr_003', name: 'Meera Bai', email: 'meera.pottery@jaipur.org', role: 'USER', created: '2026-06-15' },
  { id: 'usr_004', name: 'Admin User', email: 'admin@swadeshi.gov.in', role: 'ADMIN', created: '2026-04-10' }
];

function App() {
  // --- Navigation & Filter States ---
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Interactive Feature States ---
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // --- UI Overlay States ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('swadeshi_user') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('swadeshi_role') || 'USER');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin users view state
  const [showUsersDir, setShowUsersDir] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync state if user exists in local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('swadeshi_user');
    const savedRole = localStorage.getItem('swadeshi_role');
    if (savedUser) {
      setUsername(savedUser);
      setUserRole(savedRole || 'USER');
    }
  }, []);

  // --- Business Logic ---
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      triggerToast('Removed from Wishlist.');
    } else {
      setWishlist([...wishlist, id]);
      triggerToast('Added to Wishlist!');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    triggerToast(`Added ${product.name} to Cart.`);
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleMockLogin = (e) => {
    e.preventDefault();
    if (loginEmail) {
      // Simulate admin profile if 'admin' is in the email
      const isAdmin = loginEmail.toLowerCase().includes('admin');
      const parsedName = loginEmail.split('@')[0];
      const capitalized = parsedName.charAt(0).toUpperCase() + parsedName.slice(1);
      
      const role = isAdmin ? 'ADMIN' : 'USER';
      setUsername(capitalized);
      setUserRole(role);
      
      localStorage.setItem('swadeshi_user', capitalized);
      localStorage.setItem('swadeshi_role', role);
      setIsLoginOpen(false);
      
      triggerToast(`Welcome back, ${capitalized} (${role})!`);
      // Reset forms
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleLogout = () => {
    setUsername('');
    setUserRole('USER');
    setShowUsersDir(false);
    localStorage.removeItem('swadeshi_user');
    localStorage.removeItem('swadeshi_role');
    triggerToast('Logged out successfully.');
  };

  // Filter products based on Category, State, and Search Query
  const filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesState = selectedState === 'All' || product.state === selectedState;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.craftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesState && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="swadeshi-app">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="swadeshi-toast animate-slide-in">
          <span className="toast-icon">🪔</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* --- STICKY NAVIGATION BAR --- */}
      <header className="swadeshi-navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => { setActiveTab('Home'); setSelectedCategory('All'); setSelectedState('All'); }}>
            <span className="logo-mandala">🪔</span>
            <span className="logo-text">Swadeshi</span>
          </div>

          <nav className="nav-links">
            {['Home', 'Categories', 'Collections', 'Brands', 'About'].map((tab) => (
              <button 
                key={tab} 
                className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'Categories') {
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (tab === 'Collections') {
                    document.getElementById('festival-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (tab === 'Brands') {
                    document.getElementById('made-in-india-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            {/* Search Input Box */}
            <div className="nav-search-bar">
              <span className="search-icon">🔍</span>
              <input 
                id="search-input"
                type="text" 
                placeholder="Search crafts, states..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            <button 
              className="action-icon-btn" 
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
            >
              <span>❤️</span>
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </button>

            <button 
              className="action-icon-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <span>🛒</span>
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="badge-count bg-terracotta">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {username ? (
              <div className="user-profile-menu">
                <span className="user-greeting">
                  Namaste, <strong>{username}</strong>
                  <span className="role-tag">{userRole}</span>
                </span>
                <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <button className="btn-nav-login" onClick={() => setIsLoginOpen(true)}>Login</button>
            )}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="swadeshi-hero">
        <WarliCorner position="top-left" />
        <WarliCorner position="top-right" />
        
        <div className="hero-content">
          <div className="hero-text-panel">
            <span className="hero-badge-tag">🇮🇳 Celebrating Indian Heritage</span>
            <h1>Proudly Made in India.</h1>
            <p>
              From local generational artisans to trusted home-grown brands—discover 
              authentic apparel, handicrafts, and wellness products crafted with tradition, 
              organic quality, and heritage care.
            </p>
            <div className="hero-ctas">
              <button 
                className="btn btn-terracotta"
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Authentic Crafts
              </button>
              <button 
                className="btn btn-outline-maroon"
                onClick={() => document.getElementById('state-explorer-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore by State
              </button>
            </div>
          </div>

          <div className="hero-graphics-panel">
            {/* Mandala graphic overlaying a collage representation */}
            <div className="mandala-outer">
              <div className="mandala-inner">
                <div className="mandala-center">
                  <span className="mandala-icon">🪔</span>
                </div>
              </div>
            </div>
            <div className="heritage-card animate-float">
              <h4>Artisan Hand-Woven Textiles</h4>
              <p>Chanderi • Ikat • Pochampally</p>
              <span className="origin-stamp">Origin: Madhya Pradesh</span>
            </div>
          </div>
        </div>
      </section>

      <KolamDivider />

      {/* --- FEATURED CATEGORIES --- */}
      <section id="categories-section" className="swadeshi-categories">
        <div className="section-header text-center">
          <h2>Featured Heritage Categories</h2>
          <p>Carefully curated collections representing India's traditional crafts and wellness legacy.</p>
        </div>

        <div className="categories-grid">
          {[
            { name: 'Handloom', icon: '🧵', count: '142 Products' },
            { name: 'Handicrafts', icon: '🏺', count: '98 Products' },
            { name: 'Ayurveda', icon: '🌿', count: '64 Products' },
            { name: 'Fashion', icon: '👗', count: '210 Products' },
            { name: 'Home Decor', icon: '🏡', count: '85 Products' },
            { name: 'Kitchen', icon: '☕', count: '43 Products' },
            { name: 'Books', icon: '📚', count: '27 Products' },
            { name: 'Festival Collection', icon: '🪔', count: 'Exclusive' },
          ].map((cat) => (
            <div 
              key={cat.name} 
              className={`category-pill-card ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.name === selectedCategory ? 'All' : cat.name);
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <div className="cat-details">
                <h4>{cat.name}</h4>
                <span>{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- STATE EXPLORER --- */}
      <section id="state-explorer-section" className="swadeshi-state-explorer">
        <div className="section-header">
          <h2>🇮🇳 State Heritage Explorer</h2>
          <p>Browse signature handicrafts and products catalogued by their Indian state of origin.</p>
        </div>

        <div className="states-scroller">
          <button 
            className={`state-card-btn ${selectedState === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedState('All')}
          >
            All States
          </button>
          {[
            { code: 'TG', name: 'Telangana', specialty: 'Pochampally Weaving' },
            { code: 'KL', name: 'Kerala', specialty: 'Ayurvedic Formulations' },
            { code: 'RJ', name: 'Rajasthan', specialty: 'Blue Pottery & Block Prints' },
            { code: 'JK', name: 'Kashmir', specialty: 'Pashmina & Saffron' },
            { code: 'AS', name: 'Assam', specialty: 'Muga Silk & Tea' },
            { code: 'TN', name: 'Tamil Nadu', specialty: 'Kanchipuram Silk' },
            { code: 'GJ', name: 'Gujarat', specialty: 'Patola & Bandhani' },
            { code: 'MP', name: 'Madhya Pradesh', specialty: 'Chanderi Weaving' },
            { code: 'CG', name: 'Chhattisgarh', specialty: 'Dhokra Brass Craft' },
            { code: 'WB', name: 'West Bengal', specialty: 'Jute Handlooms' },
            { code: 'KA', name: 'Karnataka', specialty: 'Sandalwood & Carving' }
          ].map((st) => (
            <button 
              key={st.name} 
              className={`state-card-btn ${selectedState === st.name ? 'active' : ''}`}
              onClick={() => setSelectedState(st.name === selectedState ? 'All' : st.name)}
            >
              <span className="state-badge-circle">{st.code}</span>
              <div className="state-btn-text">
                <strong>{st.name}</strong>
                <span>{st.specialty}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* --- MADE IN INDIA - BRAND STORIES --- */}
      <section id="made-in-india-section" className="made-in-india-stories">
        <div className="section-header text-center">
          <h2>Empowering Indian Businesses</h2>
          <p>Every purchase supports generations of traditional weavers, local artisans, and home-grown MSMEs.</p>
        </div>

        <div className="brand-stories-grid">
          <div className="brand-story-card">
            <div className="brand-card-top">
              <span className="badge-origin">Madhya Pradesh</span>
              <span className="badge-type">MSME Certified</span>
            </div>
            <h3>Taneira Handlooms</h3>
            <p className="brand-narrative">
              "We work directly with 150+ master weavers in Madhya Pradesh to preserve Chanderi 
              cotton-silk techniques. Our patterns use raw vegetable dyes, ensuring biodegradable 
              finishes and fair living wages."
            </p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Cluster:</strong> Bunkaar Cooperative</span>
              <span className="stamp-verified">✓ Authentic Handloom</span>
            </div>
          </div>

          <div className="brand-story-card highlighted-card">
            <div className="brand-card-top">
              <span className="badge-origin">Rajasthan</span>
              <span className="badge-type">Artisan Spotlight</span>
            </div>
            <h3>Jaipur Claycrafts</h3>
            <p className="brand-narrative">
              "Jaipur Blue Pottery had nearly disappeared until local family clusters revived the 
              cobalt glaze formula. Because it utilizes quartz rather than clay, every piece 
              is incredibly light, water-impervious, and hand-painted."
            </p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Lead:</strong> Meera Bai (Generational Master)</span>
              <span className="stamp-verified">✓ 100% Clay-Free Pottery</span>
            </div>
          </div>

          <div className="brand-story-card">
            <div className="brand-card-top">
              <span className="badge-origin">Kerala</span>
              <span className="badge-type">Organic Standard</span>
            </div>
            <h3>Forest Essentials Heritage</h3>
            <p className="brand-narrative">
              "Our skin formulations are prepared in rural Kerala using heritage methods. We employ 
              local farming cooperatives to harvest fresh herbs, cardamoms, and coconuts at sunrise 
              to lock in maximum botanical potency."
            </p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Lead:</strong> Malabar Herb Growers Co-Op</span>
              <span className="stamp-verified">✓ Sustainable Agriculture</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MOCK USER PANEL FOR ADMIN SIGN IN --- */}
      {username && userRole === 'ADMIN' && (
        <section className="admin-quick-links">
          <div className="welcome-card">
            <h2>Welcome Admin, {username}!</h2>
            <p>Access simulated backend databases and registers securely from the registry utility.</p>
            <button className="btn btn-admin" onClick={() => setShowUsersDir(!showUsersDir)}>
              {showUsersDir ? 'Hide User Directory' : 'Access User Directory (Mock API)'}
            </button>
          </div>

          {showUsersDir && (
            <div className="admin-section animate-fade-in" style={{ marginTop: '20px' }}>
              <h3>Simulated Registered Users Directory</h3>
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_REGISTERED_USERS.map((u) => (
                      <tr key={u.id}>
                        <td><code>{u.id}</code></td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                        <td>{u.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* --- TRENDING PRODUCTS GRID --- */}
      <section id="products-section" className="swadeshi-trending-products">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Trending Indian Creations</h2>
            <p>
              Showing {filteredProducts.length} authentic products 
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              {selectedState !== 'All' ? ` from ${selectedState}` : ''}
            </p>
          </div>
          {(selectedCategory !== 'All' || selectedState !== 'All' || searchQuery) && (
            <button 
              className="clear-all-filters-btn" 
              onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            >
              Reset Filters ×
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products-fallback">
            <span className="fallback-icon">🏺</span>
            <h3>No Products Match Your Criteria</h3>
            <p>Try resetting your category or state filters to explore more handcrafted goods.</p>
            <button 
              className="btn btn-terracotta" 
              onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            >
              View All Creations
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                {/* Product Image Area (SVG Vector Illustration) */}
                <div className="product-image-frame" onClick={() => setQuickViewProduct(product)}>
                  {product.illustration}
                  
                  {/* Absolute Badges */}
                  <div className="product-card-badges">
                    <span className="badge-origin-label">📍 {product.state}</span>
                    {product.isSustainable && (
                      <span className="badge-sustainable-leaf" title="Organic/Biodegradable Materials">🌿 Eco</span>
                    )}
                  </div>
                </div>

                {/* Product Content Details */}
                <div className="product-card-info">
                  <div className="product-brand-line">
                    <span className="brand-name">{product.brand}</span>
                    <span className="craft-type-tag">{product.craftType}</span>
                  </div>
                  
                  <h3 onClick={() => setQuickViewProduct(product)}>{product.name}</h3>
                  
                  <div className="product-rating-row">
                    <span className="rating-stars">{"★".repeat(Math.floor(product.rating))} ({product.rating})</span>
                    {product.isMSME && (
                      <span className="badge-msme-support">👥 Supports Small Business</span>
                    )}
                  </div>

                  <div className="product-card-footer">
                    <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <div className="product-card-actions">
                      <button 
                        className={`btn-wishlist-toggle ${wishlist.includes(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        title="Add to Wishlist"
                      >
                        {wishlist.includes(product.id) ? '❤️' : '🤍'}
                      </button>
                      <button 
                        className="btn btn-terracotta btn-sm"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- FESTIVAL COLLECTION BANNER SLIDER --- */}
      <section id="festival-section" className="swadeshi-festival-showcase">
        <div className="section-header text-center">
          <h2>🪔 Shubh Utsav Festival Picks</h2>
          <p>Specially curated collections to bring joy, light, and heritage tradition to your home during auspicious times.</p>
        </div>

        <div className="festival-banners-grid">
          <div className="fest-banner-card festival-diwali">
            <div className="fest-overlay">
              <span className="fest-badge">Deepavali Collection</span>
              <h3>Festival of Lights & Luxury</h3>
              <p>Hand-poured ghee diyas, pure brass puja thalis, and pure gold thread Banarasi silk sarees.</p>
              <button 
                className="btn btn-outline-white"
                onClick={() => { setSelectedCategory('Festival Collection'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Browse Diwali Picks
              </button>
            </div>
          </div>

          <div className="fest-banner-card festival-pongal">
            <div className="fest-overlay">
              <span className="fest-badge">Sankranti & Pongal</span>
              <h3>Harvest & Handlooms</h3>
              <p>Traditional brass cookware, raw terracotta servers, and hand-woven Kasavu apparel from Kerala.</p>
              <button 
                className="btn btn-outline-white"
                onClick={() => { setSelectedState('Kerala'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Explore Southern Harvest
              </button>
            </div>
          </div>

          <div className="fest-banner-card festival-raksha">
            <div className="fest-overlay">
              <span className="fest-badge">Raksha Bandhan</span>
              <h3>Sacred Threads of Jute & Seed</h3>
              <p>Organic cotton, plant-seeded eco-friendly rakhis, and handcrafted wooden sweet hampers.</p>
              <button 
                className="btn btn-outline-white"
                onClick={() => { setSelectedCategory('Handicrafts'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Explore Eco-Rakhis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY SHOP SWADESHI --- */}
      <section className="swadeshi-benefits">
        <div className="section-header text-center">
          <h2>Why Choose Swadeshi</h2>
          <p>We connect you directly to the roots of Indian heritage, guaranteeing fair trade and authenticity.</p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">👥</span>
            <h3>Support Local Businesses</h3>
            <p>Over 80% of our sales value goes directly to artisan clusters and MSME units, securing rural livelihood.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🛡️</span>
            <h3>Authentic Heritage Products</h3>
            <p>Every handloom and handicraft product carries a certified Origin label verifying geographic authenticity.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🎨</span>
            <h3>Generational Craft Quality</h3>
            <p>We source items constructed using age-old ancestral techniques passed down through generations.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🌱</span>
            <h3>Eco-Friendly & Sustainable</h3>
            <p>All items use organic materials, natural colors, and environment-friendly packaging standards.</p>
          </div>
        </div>
      </section>

      {/* --- ARTISAN SPOTLIGHT --- */}
      <section className="artisan-spotlight-section">
        <div className="artisan-spotlight-wrapper">
          <div className="artisan-graphics">
            {/* Generational clay potter SVG placeholder visual */}
            <div className="artisan-avatar-frame">
              <svg viewBox="0 0 100 100" width="160" height="160">
                <circle cx="50" cy="50" r="48" fill="var(--color-secondary-bg)" stroke="var(--color-secondary-accent)" strokeWidth="2" />
                <path d="M50,15 C60,15 65,25 65,35 C65,48 50,55 50,55 C50,55 35,48 35,35 C35,25 40,15 50,15 Z" fill="var(--color-primary-accent)" />
                <path d="M20,80 C20,65 35,62 50,62 C65,62 80,65 80,80 Z" fill="var(--color-primary-accent)" />
                <circle cx="50" cy="32" r="6" fill="#FAF7F2" />
              </svg>
            </div>
            <span className="spotlight-tag">Artisan of the Week</span>
          </div>

          <div className="artisan-details-text">
            <span className="artisan-origin-badge">Jaipur, Rajasthan</span>
            <h2>Meera Bai</h2>
            <h3>5th Generation Master Blue Potter</h3>
            <blockquote className="artisan-quote">
              "We paint cobalt designs by hand under the light of early morning. Because we do not use 
              clay, our pottery survives centuries without cracking. Reviving this craft saved our 
              community and feeds 40 families."
            </blockquote>
            <p className="artisan-narrative-paragraph">
              Meera Bai is one of the few remaining masters of Jaipur\'s heritage blue pottery, 
              reviving the Mughal-era glaze recipes that use mineral paints like cobalt oxide and copper. 
              Every vase she creates takes 14 days of meticulous sculpting, baking, and hand-painting.
            </p>
            <button 
              className="btn btn-terracotta"
              onClick={() => { setSelectedState('Rajasthan'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Shop Meera's Creations
            </button>
          </div>
        </div>
      </section>

      {/* --- CUSTOMER TESTIMONIALS --- */}
      <section className="swadeshi-testimonials">
        <div className="section-header text-center">
          <h2>Stories from Our Community</h2>
          <p>What our patrons say about their journey to discover Indian luxury.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <span className="quote-mark">“</span>
            <p>
              "The sheer weight and breathability of the Chanderi saree I ordered is phenomenal. 
              You can immediately tell it was woven by a master artisan and not rolled off an industrial powerloom."
            </p>
            <div className="client-info">
              <strong>Aditi Sharma</strong>
              <span>New Delhi • Verified Patron</span>
            </div>
          </div>

          <div className="testimonial-card">
            <span className="quote-mark">“</span>
            <p>
              "I love the complete origin labeling. Reading the Know Your Craft history cards on the Blue Pottery 
              vase let me explain the cultural heritage of the piece to my guests. Truly outstanding luxury packaging."
            </p>
            <div className="client-info">
              <strong>Karan Johar</strong>
              <span>Mumbai • Art Collector</span>
            </div>
          </div>

          <div className="testimonial-card">
            <span className="quote-mark">“</span>
            <p>
              "The Eladi facial cream is a sensory masterpiece. It has this incredible saffron fragrance that is 
              soothing and luxury. Knowing it supports rural farming clusters in Kerala makes it even more special."
            </p>
            <div className="client-info">
              <strong>Dr. Ananya Iyer</strong>
              <span>Bengaluru • Dermatologist</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="swadeshi-footer">
        <div className="footer-container">
          <div className="footer-brand-info">
            <h3>Swadeshi</h3>
            <p>Celebrating India's finest heritage craft, handloom, and organic botanical legacy. Handcrafted with pride.</p>
            <span className="footer-copyright">&copy; {new Date().getFullYear()} Swadeshi Crafts Private Ltd. All Rights Reserved.</span>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Heritage Categories</h4>
              <ul>
                <li onClick={() => { setSelectedCategory('Handloom'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Handloom Weaves</li>
                <li onClick={() => { setSelectedCategory('Handicrafts'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Tribal Handicrafts</li>
                <li onClick={() => { setSelectedCategory('Ayurveda'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Botanical Ayurveda</li>
                <li onClick={() => { setSelectedCategory('Home Decor'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Artisanal Decor</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>State Guilds</h4>
              <ul>
                <li onClick={() => { setSelectedState('Rajasthan'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Jaipur Potters</li>
                <li onClick={() => { setSelectedState('Kerala'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Kerala Herb Guilds</li>
                <li onClick={() => { setSelectedState('Madhya Pradesh'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Chanderi Weaver Cluster</li>
                <li onClick={() => { setSelectedState('Chhattisgarh'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Bastar Metal Castings</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support & Guild</h4>
              <ul>
                <li>MSME Certification Info</li>
                <li>Artisan Fair Wages Policy</li>
                <li>Sustainable Sourcing Guide</li>
                <li>Contact & Grievance Cell</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>


      {/* ======================================================== */}
      {/* ==================== INTERACTIVE OVERLAYS ================ */}
      {/* ======================================================== */}

      {/* --- CART SLIDE-OUT DRAWER --- */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-panel animate-slide-left" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Shopping Bag 💼</h3>
              <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>×</button>
            </div>

            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-drawer-state">
                  <span className="empty-icon">🛒</span>
                  <p>Your shopping bag is currently empty.</p>
                  <button 
                    className="btn btn-terracotta"
                    onClick={() => { setIsCartOpen(false); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Explore Indian Crafts
                  </button>
                </div>
              ) : (
                <div className="drawer-items-list">
                  {cart.map((item) => (
                    <div className="drawer-item-card" key={item.product.id}>
                      <div className="drawer-item-thumbnail">
                        {item.product.illustration}
                      </div>
                      <div className="drawer-item-details">
                        <h4>{item.product.name}</h4>
                        <span className="drawer-item-brand">{item.product.brand}</span>
                        <div className="drawer-item-qty-row">
                          <div className="qty-selector">
                            <button onClick={() => updateCartQty(item.product.id, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product.id, 1)}>+</button>
                          </div>
                          <span className="drawer-item-price">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="cart-summary-line">
                  <span>Bag Subtotal</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <p className="cart-notice">👥 Your purchase supports local artisans and MSMEs directly.</p>
                <button 
                  className="btn btn-terracotta btn-block"
                  onClick={() => {
                    setCart([]);
                    setIsCartOpen(false);
                    triggerToast('Checkout successful! Namaste.');
                  }}
                >
                  Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- WISHLIST SLIDE-OUT DRAWER --- */}
      {isWishlistOpen && (
        <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)}>
          <div className="drawer-panel animate-slide-left" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>My Favorites ❤️</h3>
              <button className="close-drawer-btn" onClick={() => setIsWishlistOpen(false)}>×</button>
            </div>

            <div className="drawer-content">
              {wishlist.length === 0 ? (
                <div className="empty-drawer-state">
                  <span className="empty-icon">❤️</span>
                  <p>No favorites saved yet.</p>
                </div>
              ) : (
                <div className="drawer-items-list">
                  {wishlist.map((id) => {
                    const product = PRODUCTS_DATA.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div className="drawer-item-card" key={product.id}>
                        <div className="drawer-item-thumbnail">
                          {product.illustration}
                        </div>
                        <div className="drawer-item-details">
                          <h4>{product.name}</h4>
                          <span className="drawer-item-brand">{product.brand}</span>
                          <span className="drawer-item-price">₹{product.price.toLocaleString('en-IN')}</span>
                          <div className="wishlist-action-links">
                            <button 
                              className="link-btn-terracotta"
                              onClick={() => { addToCart(product); toggleWishlist(product.id); }}
                            >
                              Move to Bag
                            </button>
                            <button 
                              className="link-btn-grey"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIN OVERLAY MODAL --- */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-card animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsLoginOpen(false)}>×</button>
            <div className="modal-header">
              <span className="modal-header-icon">🪔</span>
              <h2>Welcome to Swadeshi</h2>
              <p>Sign in to access your custom collections and artisan registry.</p>
            </div>

            <form onSubmit={handleMockLogin} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-email-input">Email Address</label>
                <input 
                  id="modal-email-input" 
                  type="email" 
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-password-input">Password</label>
                <input 
                  id="modal-password-input" 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="modal-quick-logins" style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <button 
                  type="button" 
                  id="autofill-admin-btn"
                  className="btn btn-outline-maroon btn-sm"
                  onClick={() => {
                    setLoginEmail('admin@swadeshi.gov.in');
                    setLoginPassword('password123');
                  }}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
                >
                  Autofill Admin
                </button>
                <button 
                  type="button" 
                  id="autofill-customer-btn"
                  className="btn btn-outline-maroon btn-sm"
                  onClick={() => {
                    setLoginEmail('patron@swadeshi.in');
                    setLoginPassword('password123');
                  }}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
                >
                  Autofill Customer
                </button>
              </div>

              <button type="submit" id="login-submit-btn" className="btn btn-terracotta btn-block">Sign In</button>
            </form>

            <div className="modal-footer-mock text-center">
              <p>First time visiting? You can enter any mock email and password to log in.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- QUICK VIEW / KNOW YOUR CRAFT MODAL --- */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-card craft-details-modal animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setQuickViewProduct(null)}>×</button>
            
            <div className="craft-modal-grid">
              <div className="craft-modal-visual">
                {quickViewProduct.illustration}
                <div className="craft-origin-seal">
                  <span>Made in</span>
                  <strong>{quickViewProduct.state}</strong>
                </div>
              </div>

              <div className="craft-modal-text">
                <div className="craft-badges-row">
                  <span className="origin-label-badge">📍 {quickViewProduct.state} • {quickViewProduct.craftType}</span>
                  {quickViewProduct.isSustainable && <span className="sustainable-leaf-badge">🌿 Sustainable Choice</span>}
                </div>

                <h2>{quickViewProduct.name}</h2>
                <div className="craft-brand-rating">
                  <span className="craft-brand-sub">By <strong>{quickViewProduct.brand}</strong></span>
                  <span className="rating-stars">{"★".repeat(Math.floor(quickViewProduct.rating))} ({quickViewProduct.rating})</span>
                </div>

                <div className="craft-modal-price">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </div>

                {/* Cultural Significance & Craft History - Know Your Craft */}
                <div className="know-your-craft-panel">
                  <h4>🌾 Know Your Craft</h4>
                  <p>{quickViewProduct.history}</p>
                </div>

                <div className="craft-info-table">
                  <div className="info-table-row">
                    <span>Authentic Materials:</span>
                    <strong>{quickViewProduct.materials}</strong>
                  </div>
                  <div className="info-table-row">
                    <span>Artisan Source:</span>
                    <strong>{quickViewProduct.artisan}</strong>
                  </div>
                  {quickViewProduct.isMSME && (
                    <div className="info-table-row msme-verified-row">
                      <span>MSME Support:</span>
                      <strong>👥 Generates Local Employment</strong>
                    </div>
                  )}
                </div>

                <div className="craft-modal-ctas">
                  <button 
                    className="btn btn-terracotta"
                    onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                  >
                    Add to Shopping Bag
                  </button>
                  <button 
                    className={`btn btn-outline-maroon ${wishlist.includes(quickViewProduct.id) ? 'active' : ''}`}
                    onClick={() => { toggleWishlist(quickViewProduct.id); }}
                  >
                    {wishlist.includes(quickViewProduct.id) ? '❤️ In Favorites' : '♡ Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
