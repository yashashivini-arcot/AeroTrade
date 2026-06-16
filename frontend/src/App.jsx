/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

// HTML5 Canvas sparkline chart renderer (Green for gains, Red for losses)
function drawChart(canvas, prices) {
  if (!canvas || !prices || prices.length < 2) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const values = prices.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min === 0 ? 1 : max - min;

  const padMin = min - range * 0.1;
  const padMax = max + range * 0.1;
  const padRange = padMax - padMin;

  const getX = (index) => (index / (prices.length - 1)) * (width - 40) + 20;
  const getY = (val) => height - ((val - padMin) / padRange) * (height - 40) - 20;

  // Color code chart based on gain/loss performance status
  const isGreen = values[values.length - 1] >= values[0];
  const strokeColor = isGreen ? '#10b981' : '#ef4444';
  const gradientColor = isGreen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  // Draw Grid Lines (Bloomberg terminal style)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const y = (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(width - 10, y);
    ctx.stroke();
  }

  // Draw Line Chart
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(values[0]));
  for (let i = 1; i < values.length; i++) {
    ctx.lineTo(getX(i), getY(values[i]));
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Draw Gradient Fill
  ctx.lineTo(getX(values.length - 1), height);
  ctx.lineTo(getX(0), height);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, gradientColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw start & end points
  const drawPoint = (idx, value) => {
    ctx.beginPath();
    ctx.arc(getX(idx), getY(value), 4.5, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0B0B0D';
    ctx.stroke();
  };
  drawPoint(0, values[0]);
  drawPoint(values.length - 1, values[values.length - 1]);
}

function App() {
  // Authentication & User state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  
  // Auth Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation States
  const [touched, setTouched] = useState({});

  // Trading & Data State
  const [stocks, setStocks] = useState([]);
  const [prevStocks, setPrevStocks] = useState({});
  const [flashes, setFlashes] = useState({});
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); // for Admin

  // Watchlist filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  // Trade Modal State
  const [selectedStockId, setSelectedStockId] = useState(
    localStorage.getItem('selectedStockId') || null
  );
  const selectedStock = stocks.find(s => s._id === selectedStockId) || (stocks.length > 0 ? (stocks.find(s => s.symbol === 'AAPL') || stocks[0]) : null);
  const setSelectedStock = (stock) => {
    const id = stock ? stock._id : null;
    setSelectedStockId(id);
    if (id) {
      localStorage.setItem('selectedStockId', id);
    } else {
      localStorage.removeItem('selectedStockId');
    }
  };
  const [tradeType, setTradeType] = useState('BUY');
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState('');

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const getLoginErrors = () => {
    const errs = {};
    if (!email) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    return errs;
  };

  const getRegisterErrors = () => {
    const errs = {};
    if (!name) {
      errs.name = 'Full Name is required';
    }
    if (!email) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const getTradeErrors = () => {
    const errs = {};
    if (!selectedStock) {
      errs.stock = 'Stock must be selected';
    }
    const qtyStr = String(tradeQty).trim();
    if (!qtyStr) {
      errs.quantity = 'Quantity is required';
    } else {
      const qtyNum = Number(qtyStr);
      if (isNaN(qtyNum)) {
        errs.quantity = 'Quantity must be a numeric value';
      } else if (qtyNum <= 0) {
        errs.quantity = 'Quantity must be a positive number';
      } else if (!Number.isInteger(qtyNum)) {
        errs.quantity = 'Quantity must be a whole number';
      }
    }
    return errs;
  };

  const loginErrors = getLoginErrors();
  const registerErrors = getRegisterErrors();
  const tradeErrors = getTradeErrors();

  const isLoginInvalid = Object.keys(loginErrors).length > 0;
  const isRegisterInvalid = Object.keys(registerErrors).length > 0;
  const isSubmitDisabled = authTab === 'login' ? isLoginInvalid : isRegisterInvalid;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleTabSwitch = (tab) => {
    setAuthTab(tab);
    setAuthError('');
    setAuthSuccess('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTouched({});
  };

  // Navigation / Mode state
  const [adminMode, setAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState('stocks'); // 'stocks' or 'trades'

  // Admin Stock Form State
  const [adminStockId, setAdminStockId] = useState('');
  const [adminSymbol, setAdminSymbol] = useState('');
  const [adminCompanyName, setAdminCompanyName] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminSector, setAdminSector] = useState('Technology');
  const [adminMarketCap, setAdminMarketCap] = useState('');
  const [adminError, setAdminError] = useState('');

  // --- NEW WORKSPACE STATES ---
  const [favorites, setFavorites] = useState([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);

  // Canvas refs for charts
  const canvasRef = useRef(null);
  const analyticsCanvasRef = useRef(null);

  // Helper fetch configs
  const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // Token might be expired
        setToken('');
      }
    } catch (err) {
      console.error(err);
      setToken('');
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/news`);
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (err) {
      console.error('Error fetching financial news feed:', err);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await fetch(`${API_BASE}/stocks`);
      if (res.ok) {
        const data = await res.json();
        setStocks(data);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions/all`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setAllTransactions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load User Profile on token change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setPortfolio(null);
      setTransactions([]);
      setFavorites([]);
      setNews([]);
    }
  }, [token]);

  // Load and sync favorites when user is loaded
  useEffect(() => {
    if (user?.email) {
      const stored = localStorage.getItem(`favorites_${user.email}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        const defaults = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
        setFavorites(defaults);
        localStorage.setItem(`favorites_${user.email}`, JSON.stringify(defaults));
      }
    }
  }, [user]);

  // Toggle favorite pin action
  const toggleFavorite = (symbol) => {
    if (!user?.email) return;
    let nextFavs;
    if (favorites.includes(symbol)) {
      nextFavs = favorites.filter(fav => fav !== symbol);
    } else {
      nextFavs = [...favorites, symbol];
    }
    setFavorites(nextFavs);
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(nextFavs));
  };

  // Periodic polling for stocks and portfolio (every 5 seconds)
  useEffect(() => {
    if (!token) return;

    // Initial load
    fetchStocks();
    fetchPortfolio();
    fetchTransactions();
    fetchNews();

    const interval = setInterval(() => {
      fetchStocks();
      fetchPortfolio();
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // Fetch all transactions for Admin when tab changes
  useEffect(() => {
    if (token && user?.role === 'ADMIN' && adminMode && adminTab === 'trades') {
      fetchAllTransactions();
    }
  }, [token, user, adminMode, adminTab]);

  // Draw chart in trade modal
  useEffect(() => {
    if (selectedStock && canvasRef.current && showTradeModal) {
      drawChart(canvasRef.current, selectedStock.historicalPrices || []);
    }
  }, [selectedStock, showTradeModal]);

  // Draw chart in Interactive Analytics dashboard panel
  useEffect(() => {
    if (selectedStock && analyticsCanvasRef.current && !adminMode) {
      drawChart(analyticsCanvasRef.current, selectedStock.historicalPrices || []);
    }
  }, [selectedStock, adminMode]);

  // Handle price flashing when quote lists update
  useEffect(() => {
    if (stocks.length === 0) return;

    const newFlashes = { ...flashes };
    let hasChanges = false;

    stocks.forEach((stock) => {
      const prev = prevStocks[stock._id];
      if (prev !== undefined && prev !== stock.currentPrice) {
        newFlashes[stock._id] = stock.currentPrice > prev ? 'up' : 'down';
        hasChanges = true;

        // Clear flash after 1.2s
        setTimeout(() => {
          setFlashes((curr) => {
            const next = { ...curr };
            delete next[stock._id];
            return next;
          });
        }, 1200);
      }
    });

    if (hasChanges) {
      setFlashes(newFlashes);
    }

    // Save current prices as prev for next comparison
    const pricesMap = {};
    stocks.forEach((s) => {
      pricesMap[s._id] = s.currentPrice;
    });
    setPrevStocks(pricesMap);
  }, [stocks]);

  // Auth Operations
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    // Pre-submission client-side validation check
    const currentErrors = authTab === 'login' ? getLoginErrors() : getRegisterErrors();
    if (Object.keys(currentErrors).length > 0) {
      // Mark all relevant fields as touched
      const allTouched = {};
      if (authTab === 'register') allTouched.name = true;
      allTouched.email = true;
      allTouched.password = true;
      if (authTab === 'register') allTouched.confirmPassword = true;
      setTouched(allTouched);
      return;
    }

    const url = authTab === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    const bodyObj = authTab === 'login' 
      ? { email, password } 
      : { name, email, password, confirmPassword };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj),
      });
      const data = await res.json();

      if (res.ok) {
        if (authTab === 'register') {
          setAuthSuccess('Registration successful! Redirecting to login terminal...');
          // Clear registration fields
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTouched({});
          setTimeout(() => {
            setAuthTab('login');
            setAuthSuccess('');
          }, 2000);
        } else {
          setToken(data.token);
          // Clear fields
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTouched({});
        }
      } else {
        setAuthError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setAuthError('Server connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setAdminMode(false);
    setSelectedStockId(null);
    localStorage.removeItem('selectedStockId');
  };

  // Trading Operations
  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    setTradeError('');
    setTradeSuccess('');

    // Pre-submission client-side validation check
    const currentTradeErrors = getTradeErrors();
    if (Object.keys(currentTradeErrors).length > 0) {
      setTradeError(currentTradeErrors.quantity || currentTradeErrors.stock || 'Invalid order data');
      return;
    }

    const endpoint = tradeType === 'BUY' ? 'buy' : 'sell';

    try {
      const res = await fetch(`${API_BASE}/trade/${endpoint}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          stockId: selectedStock._id,
          quantity: tradeQty,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setTradeSuccess(data.message);
        setTradeQty(1);
        fetchPortfolio();
        fetchTransactions();
      } else {
        setTradeError(data.message || 'Trade execution failed');
      }
    } catch (err) {
      console.error('Trade execution error:', err);
      setTradeError('Error executing trade. Please try again.');
    }
  };

  // Admin Stock Form submit
  const handleAdminStockSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');

    if (!adminSymbol || !adminCompanyName || !adminPrice || !adminMarketCap || !adminSector) {
      setAdminError('Please fill in all fields');
      return;
    }

    const payload = {
      symbol: adminSymbol,
      companyName: adminCompanyName,
      currentPrice: Number(adminPrice),
      marketCap: Number(adminMarketCap),
      sector: adminSector,
    };

    const url = adminStockId ? `${API_BASE}/stocks/${adminStockId}` : `${API_BASE}/stocks`;
    const method = adminStockId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeader(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        // Reset Form
        setAdminStockId('');
        setAdminSymbol('');
        setAdminCompanyName('');
        setAdminPrice('');
        setAdminMarketCap('');
        setAdminSector('Technology');
        fetchStocks();
      } else {
        setAdminError(data.message || 'Failed to save stock');
      }
    } catch (err) {
      console.error('Admin stock save error:', err);
      setAdminError('Server connection error. Please try again.');
    }
  };

  const handleEditStock = (stock) => {
    setAdminStockId(stock._id);
    setAdminSymbol(stock.symbol);
    setAdminCompanyName(stock.companyName);
    setAdminPrice(stock.currentPrice);
    setAdminMarketCap(stock.marketCap);
    setAdminSector(stock.sector);
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock? This will delete all trade capabilities for this ticker.')) return;
    try {
      const res = await fetch(`${API_BASE}/stocks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (res.ok) {
        fetchStocks();
        if (selectedStockId === id) {
          setSelectedStock(null);
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete stock');
      }
    } catch (err) {
      console.error(err);
    }
  };



  // Filters
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          stock.companyName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sectorsList = ['All', 'Technology', 'Finance', 'Retail', 'Automotive', 'Entertainment'];

  // Format Helper
  const formatCur = (val) => {
    if (val === undefined || val === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // If not authenticated, render Login/Register
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">AeroTrade</span>
            <div className="auth-subtitle">Premium Trading Simulation Terminal</div>
          </div>

          <div className="auth-tabs">
            <button
              onClick={() => handleTabSwitch('login')}
              className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabSwitch('register')}
              className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
            >
              Join Terminal
            </button>
          </div>

          {authError && <div className="auth-error">{authError}</div>}
          {authSuccess && (
            <div
              className="auth-success"
              style={{
                background: 'var(--color-success-bg)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--color-success)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '14px',
                fontSize: '13px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {authTab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTouched((prev) => ({ ...prev, name: true }));
                  }}
                  onBlur={() => handleBlur('name')}
                  className="form-input"
                  autoComplete="off"
                />
                {touched.name && registerErrors.name && (
                  <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    {registerErrors.name}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@terminal.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched((prev) => ({ ...prev, email: true }));
                }}
                onBlur={() => handleBlur('email')}
                className="form-input"
                autoComplete="email"
              />
              {authTab === 'login'
                ? touched.email && loginErrors.email && (
                    <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      {loginErrors.email}
                    </span>
                  )
                : touched.email && registerErrors.email && (
                    <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      {registerErrors.email}
                    </span>
                  )}
            </div>

            <div className="form-group">
              <label className="form-label">Access Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched((prev) => ({ ...prev, password: true }));
                }}
                onBlur={() => handleBlur('password')}
                className="form-input"
                autoComplete="current-password"
              />
              {authTab === 'login'
                ? touched.password && loginErrors.password && (
                    <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      {loginErrors.password}
                    </span>
                  )
                : touched.password && registerErrors.password && (
                    <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      {registerErrors.password}
                    </span>
                  )}
            </div>

            {authTab === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setTouched((prev) => ({ ...prev, confirmPassword: true }));
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  className="form-input"
                  autoComplete="new-password"
                />
                {touched.confirmPassword && registerErrors.confirmPassword && (
                  <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    {registerErrors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="btn btn-primary"
              style={{
                marginTop: '10px',
                background: isSubmitDisabled ? 'var(--text-muted)' : 'var(--color-accent)',
                color: isSubmitDisabled ? 'var(--text-secondary)' : '#000',
                cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitDisabled ? 'none' : '0 4px 12px rgba(255, 140, 0, 0.25)',
                opacity: isSubmitDisabled ? 0.6 : 1,
              }}
            >
              {authTab === 'login' ? 'Initialize Session' : 'Establish Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loaded calculations
  const overallPL = portfolio ? portfolio.profitLoss : 0;
  const totalInvested = portfolio ? portfolio.totalInvestment : 0;
  const overallPLPercent = totalInvested > 0 ? (overallPL / totalInvested) * 100 : 0;

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <svg
            className="nav-brand-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
          AeroTrade
        </div>

        <div className="nav-menu">
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`mode-btn ${adminMode ? 'active' : ''}`}
            >
              {adminMode ? 'Switch to Trader' : 'Admin Panel'}
            </button>
          )}

          <div className="nav-user">
            {/* Watchlist Star Toggle */}
            {!adminMode && (
              <button 
                onClick={() => setIsWatchlistOpen(true)} 
                className="nav-star-toggle" 
                title="View Saved Bookmarks"
                style={{ marginRight: '12px' }}
              >
                ⭐
                {favorites.length > 0 && <span className="nav-star-badge">{favorites.length}</span>}
              </button>
            )}

            <div className="nav-user-info">
              <span className="nav-user-name">
                {user?.name}
                {user?.role === 'ADMIN' && <span className="nav-user-role">Admin</span>}
              </span>
            </div>
            <button onClick={handleLogout} className="nav-logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid View */}
      {!adminMode ? (
        <main className="dashboard-main">
          
          {/* News Scrolling Ticker Section */}
          <div className="dashboard-section" style={{ padding: '16px 0', overflow: 'hidden' }}>
            <div style={{ padding: '0 30px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                📺 Real-time News Feed:
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click headlines for coverage overview</span>
            </div>
            {news.length > 0 ? (
              <div className="news-ticker-container">
                <div className="news-ticker-track">
                  {[...news, ...news].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="news-ticker-item"
                      onClick={() => setSelectedNews(item)}
                    >
                      {item.title}
                      <span className="news-ticker-source">{item.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: '0 30px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Connecting to RSS news feeds...
              </div>
            )}
          </div>

          {/* Top Section: Market Overview & Search Bar */}
          <div className="portfolio-summary-grid" style={{ gridTemplateColumns: '1.8fr 1.2fr', gap: '32px' }}>
            
            {/* Market Overview Row */}
            <div className="dashboard-section" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 className="section-title" style={{ fontSize: '13px', margin: '0' }}>Market Overview</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Live indices calculated from asset pools</span>
              </div>
              <div className="market-indices-grid">
                {(() => {
                  // Calculate indices based on real-time prices
                  let techChgSum = 0;
                  let techCount = 0;
                  let allChgSum = 0;
                  
                  stocks.forEach(s => {
                    const startPrice = s.historicalPrices?.[0]?.price || s.currentPrice;
                    const diff = s.currentPrice - startPrice;
                    const pct = startPrice > 0 ? (diff / startPrice) * 100 : 0;
                    
                    allChgSum += pct;
                    if (s.sector === 'Technology') {
                      techChgSum += pct;
                      techCount++;
                    }
                  });

                  const avgAllChg = stocks.length > 0 ? allChgSum / stocks.length : 0;
                  const avgTechChg = techCount > 0 ? techChgSum / techCount : avgAllChg;

                  const sp500Pct = avgAllChg;
                  const sp500Val = 5420.30 * (1 + sp500Pct / 100);
                  const nasdaqPct = avgTechChg;
                  const nasdaqVal = 16825.40 * (1 + nasdaqPct / 100);
                  const dowPct = avgAllChg * 0.7;
                  const dowVal = 39120.10 * (1 + dowPct / 100);

                  return (
                    <>
                      <div className="index-card">
                        <div>
                          <div className="index-name">S&P 500</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Broad Markets</div>
                        </div>
                        <div className="index-value">
                          <div>{sp500Val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <span className={`index-change ${sp500Pct >= 0 ? 'up' : 'down'}`}>
                            {sp500Pct >= 0 ? '▲' : '▼'} {Math.abs(sp500Pct).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="index-card">
                        <div>
                          <div className="index-name">NASDAQ</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tech Focus</div>
                        </div>
                        <div className="index-value">
                          <div>{nasdaqVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <span className={`index-change ${nasdaqPct >= 0 ? 'up' : 'down'}`}>
                            {nasdaqPct >= 0 ? '▲' : '▼'} {Math.abs(nasdaqPct).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="index-card">
                        <div>
                          <div className="index-name">Dow Jones</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Industrials</div>
                        </div>
                        <div className="index-value">
                          <div>{dowVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <span className={`index-change ${dowPct >= 0 ? 'up' : 'down'}`}>
                            {dowPct >= 0 ? '▲' : '▼'} {Math.abs(dowPct).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Search Bar / Watchlist Quick Bookmark Info */}
            <div className="dashboard-section" style={{ padding: '20px', justifyContent: 'center', gap: '12px' }}>
              <h3 className="section-title" style={{ fontSize: '13px', margin: '0' }}>Stock Search</h3>
              <div className="search-wrapper" style={{ width: '100%' }}>
                <svg
                  className="search-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Type company name or ticker code..."
                  className="search-input"
                  style={{ padding: '12px 16px 12px 42px' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💡 Click a stock below to analyze. Pin favorites using the star star icon.</span>
              </div>
            </div>

          </div>

          {/* Middle Section: Interactive Stock Analytics & Markets Grid */}
          <div className="dashboard-grid">
            
            {/* Column Left: Interactive Stock Analytics */}
            <div className="dashboard-section" style={{ gap: '20px' }}>
              
              {selectedStock ? (
                <>
                  {/* Stock Heading Summary */}
                  <div className="analytics-header-row">
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="symbol-badge" style={{ fontSize: '16px', padding: '4px 10px' }}>{selectedStock.symbol}</span>
                        {selectedStock.companyName}
                      </h2>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Stock Details | Business Sector: <strong>{selectedStock.sector}</strong>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setTradeQty(1);
                        setTradeError('');
                        setTradeSuccess('');
                        setTradeType('BUY');
                        setShowTradeModal(true);
                      }} 
                      className="analytics-trade-btn"
                    >
                      Trade Stock 📈
                    </button>
                  </div>

                  {/* Stock Performance Summary stats */}
                  <div className="trend-summary-grid">
                    {(() => {
                      const start24h = selectedStock.historicalPrices?.[Math.max(0, selectedStock.historicalPrices.length - 8)]?.price || selectedStock.currentPrice || 1;
                      const dailyPct = ((selectedStock.currentPrice - start24h) / start24h) * 100;
                      
                      const start5d = selectedStock.historicalPrices?.[0]?.price || selectedStock.currentPrice || 1;
                      const weeklyPct = ((selectedStock.currentPrice - start5d) / start5d) * 100;
                      
                      const monthlyPct = weeklyPct * 3.2; // simulated proportional trend

                      return (
                        <>
                          <div className="trend-mini-card">
                            <div className="trend-mini-label">Daily Change</div>
                            <div className={`trend-mini-val ${dailyPct >= 0 ? 'up' : 'down'}`}>
                              {dailyPct >= 0 ? '+' : ''}{dailyPct.toFixed(2)}%
                            </div>
                          </div>
                          <div className="trend-mini-card">
                            <div className="trend-mini-label">Weekly Change</div>
                            <div className={`trend-mini-val ${weeklyPct >= 0 ? 'up' : 'down'}`}>
                              {weeklyPct >= 0 ? '+' : ''}{weeklyPct.toFixed(2)}%
                            </div>
                          </div>
                          <div className="trend-mini-card">
                            <div className="trend-mini-label">Monthly Change</div>
                            <div className={`trend-mini-val ${monthlyPct >= 0 ? 'up' : 'down'}`}>
                              {monthlyPct >= 0 ? '+' : ''}{monthlyPct.toFixed(2)}%
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Large Chart Canvas */}
                  <div className="chart-panel">
                    <div className="chart-header">
                      <span className="chart-title">Stock Performance (Hourly Price History)</span>
                      {(() => {
                        const start = selectedStock.historicalPrices?.[0]?.price || selectedStock.currentPrice;
                        const growth = selectedStock.currentPrice >= start;
                        return (
                          <span style={{ fontSize: '11px', fontWeight: '800', color: growth ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {growth ? '▲ Trending Upward (Growth)' : '▼ Trending Downward (Declining)'}
                          </span>
                        );
                      })()}
                    </div>
                    <canvas ref={analyticsCanvasRef} className="chart-canvas" style={{ height: '230px' }} />
                  </div>

                  {/* Visual Analytics Grid (Gauges and Insights) */}
                  <div className="analytics-grid">
                    
                    {/* Position Gauge */}
                    {(() => {
                      const range = selectedStock.dailyHigh - selectedStock.dailyLow || 1;
                      const posPercent = Math.min(100, Math.max(0, ((selectedStock.currentPrice - selectedStock.dailyLow) / range) * 100));
                      return (
                        <div className="gauge-card">
                          <div className="gauge-header">
                            <span>Daily Low</span>
                            <span>Price Gauge</span>
                            <span>Daily High</span>
                          </div>
                          <div className="gauge-track">
                            <div className="gauge-track-fill" style={{ width: `${posPercent}%` }}></div>
                            <div className="gauge-pointer" style={{ left: `${posPercent}%` }}></div>
                          </div>
                          <div className="gauge-labels">
                            <span>{formatCur(selectedStock.dailyLow)}</span>
                            <span style={{ color: 'var(--color-accent)' }}>{formatCur(selectedStock.currentPrice)}</span>
                            <span>{formatCur(selectedStock.dailyHigh)}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Sector / Holdings Allocation Pie representation */}
                    {(() => {
                      const sectorData = {};
                      let total = 0;
                      
                      if (portfolio && portfolio.holdings.length > 0) {
                        portfolio.holdings.forEach(h => {
                          const stockObj = stocks.find(s => s._id === h.stockId);
                          const sector = stockObj?.sector || 'Other';
                          const val = h.quantity * (stockObj?.currentPrice || h.averageBuyPrice);
                          sectorData[sector] = (sectorData[sector] || 0) + val;
                          total += val;
                        });
                      } else {
                        stocks.forEach(s => {
                          sectorData[s.sector] = (sectorData[s.sector] || 0) + 1;
                          total += 1;
                        });
                      }
                      
                      const sectors = Object.entries(sectorData).map(([name, val]) => ({
                        name,
                        percentage: total > 0 ? (val / total) * 100 : 0
                      })).sort((a,b) => b.percentage - a.percentage);

                      const colors = {
                        'Technology': '#FF8C00',     // Neon Orange
                        'Finance': '#10b981',        // Profit Green
                        'Retail': '#ef4444',         // Loss Red
                        'Automotive': '#ffc107',     // Gold
                        'Entertainment': '#8b5cf6', // Purple
                        'Other': '#6b7280'
                      };

                      let cumulativePercent = 0;

                      return (
                        <div className="sector-allocation-card">
                          <div className="sector-pie-wrapper">
                            <svg viewBox="0 0 42 42" className="sector-pie-svg" width="80" height="80">
                              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                              {sectors.map((sec, idx) => {
                                const strokeColor = colors[sec.name] || '#6b7280';
                                const dashArray = `${sec.percentage} ${100 - sec.percentage}`;
                                const dashOffset = 100 - cumulativePercent;
                                cumulativePercent += sec.percentage;
                                return (
                                  <circle
                                    key={idx}
                                    cx="21"
                                    cy="21"
                                    r="15.91549430918954"
                                    fill="transparent"
                                    stroke={strokeColor}
                                    strokeWidth="6"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                  />
                                );
                              })}
                            </svg>
                          </div>
                          <div className="sector-legend">
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '2px' }}>
                              {portfolio && portfolio.holdings.length > 0 ? "Portfolio Sectors" : "Market Sectors"}
                            </div>
                            {sectors.slice(0, 3).map((sec, idx) => (
                              <div key={idx} className="sector-legend-item">
                                <span className="sector-legend-label">
                                  <span className="sector-dot" style={{ backgroundColor: colors[sec.name] || '#6b7280' }} />
                                  {sec.name}
                                </span>
                                <span className="sector-legend-val">{sec.percentage.toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Jargon-free Beginner Insights Card */}
                    <div className="insights-card analytics-full-width">
                      <div className="insights-title">
                        <span>💡 Beginner Insight & Details</span>
                      </div>
                      {(() => {
                        const start = selectedStock.historicalPrices?.[0]?.price || selectedStock.currentPrice;
                        const isUp = selectedStock.currentPrice >= start;
                        
                        const dailyDiff = selectedStock.dailyHigh - selectedStock.dailyLow;
                        const dailyRangePct = selectedStock.currentPrice > 0 ? (dailyDiff / selectedStock.currentPrice) * 100 : 0;
                        
                        const simulatedVolume = Math.round(selectedStock.marketCap / (selectedStock.currentPrice * 4000));

                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                            <div>
                              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Trend Summary</div>
                              <div style={{ fontWeight: '600' }}>
                                {isUp 
                                  ? "Stock is currently trending upward. More buyers are pushing the price higher."
                                  : "Stock is currently trending downward. More sellers are pushing the price lower."}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Price Volatility</div>
                              <div style={{ fontWeight: '600' }}>
                                {dailyRangePct > 2.0
                                  ? "Price is moving more than usual today. Rapid fluctuations indicate high activity."
                                  : "Price is stable today. The stock's value remains steady with narrow shifts."}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Trading Volume</div>
                              <div style={{ fontWeight: '600', fontFamily: 'var(--font-sans)' }}>
                                {simulatedVolume.toLocaleString()} shares traded. Labeled as: <strong>{simulatedVolume > 500000 ? "Highly Active" : "Moderate Interest"}</strong>.
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Market Cap (Company Size)</div>
                              <div style={{ fontWeight: '600' }}>
                                {selectedStock.marketCap >= 1000000000000 
                                  ? "Mega Enterprise. One of the largest, most stable global corporations."
                                  : "Large Business. An established market player with stable operations."}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                  Loading stock analytics data...
                </div>
              )}
            </div>

            {/* Column Right: Table Lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Markets Watchlist */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <svg
                      className="section-title-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                    Market Watchlist
                  </h3>
                  
                  <div className="market-filters">
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="sector-filter"
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      {sectorsList.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec === 'All' ? 'All Sectors' : sec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="table-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  <table className="trading-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>Pin</th>
                        <th>Ticker</th>
                        <th>Company</th>
                        <th>Quote</th>
                        <th>Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks.map((stock) => {
                        const flashType = flashes[stock._id];
                        const isPinned = favorites.includes(stock.symbol);
                        const isSelected = selectedStock?._id === stock._id;
                        return (
                          <tr
                            key={stock._id}
                            onClick={() => {
                              setSelectedStock(stock);
                              setTradeError('');
                              setTradeSuccess('');
                            }}
                            className={`${flashType === 'up' ? 'flash-up' : flashType === 'down' ? 'flash-down' : ''} ${isSelected ? 'selected-row' : ''}`}
                            style={{ background: isSelected ? 'rgba(255, 140, 0, 0.05)' : '' }}
                          >
                            <td>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(stock.symbol);
                                }}
                                className={`pin-btn ${isPinned ? 'pinned' : ''}`}
                                title={isPinned ? "Unpin stock" : "Pin stock"}
                              >
                                ★
                              </button>
                            </td>
                            <td>
                              <span className="symbol-badge">{stock.symbol}</span>
                            </td>
                            <td style={{ fontWeight: '600' }}>{stock.companyName}</td>
                            <td className={`price-indicator ${flashType === 'up' ? 'up' : flashType === 'down' ? 'down' : ''}`}>
                              {formatCur(stock.currentPrice)}
                            </td>
                            <td>
                              <span className="sector-badge">{stock.sector}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStocks.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                            No matching assets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Top Gainers & Losers compact row widgets */}
              {(() => {
                const computed = stocks.map(s => {
                  const startPrice = s.historicalPrices?.[Math.max(0, s.historicalPrices.length - 8)]?.price || s.currentPrice || 1;
                  const chgPercent = ((s.currentPrice - startPrice) / startPrice) * 100;
                  return { ...s, chgPercent };
                });
                
                const topGainers = [...computed].sort((a,b) => b.chgPercent - a.chgPercent).slice(0, 3);
                const topLosers = [...computed].sort((a,b) => a.chgPercent - b.chgPercent).slice(0, 3);

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Top Gainers */}
                    <div className="dashboard-section" style={{ padding: '20px' }}>
                      <h4 className="section-title" style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--color-success)' }}>
                        🚀 Top Gainers
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {topGainers.map(s => (
                          <div 
                            key={s._id} 
                            onClick={() => setSelectedStock(s)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', cursor: 'pointer', borderRadius: '6px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.02)' }}
                          >
                            <span>
                              <span className="symbol-badge" style={{ fontSize: '10px', padding: '2px 4px', marginRight: '6px' }}>{s.symbol}</span>
                              <span style={{ fontSize: '12px', fontWeight: '500' }}>{s.companyName.split(' ')[0]}</span>
                            </span>
                            <span style={{ color: 'var(--color-success)', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                              +{s.chgPercent.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Losers */}
                    <div className="dashboard-section" style={{ padding: '20px' }}>
                      <h4 className="section-title" style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--color-danger)' }}>
                        📉 Top Losers
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {topLosers.map(s => (
                          <div 
                            key={s._id} 
                            onClick={() => setSelectedStock(s)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', cursor: 'pointer', borderRadius: '6px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.02)' }}
                          >
                            <span>
                              <span className="symbol-badge" style={{ fontSize: '10px', padding: '2px 4px', marginRight: '6px' }}>{s.symbol}</span>
                              <span style={{ fontSize: '12px', fontWeight: '500' }}>{s.companyName.split(' ')[0]}</span>
                            </span>
                            <span style={{ color: 'var(--color-danger)', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                              {s.chgPercent.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Account Valuation & holdings Ledger */}
              <div className="dashboard-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="section-title" style={{ margin: '0' }}>
                    My Account holdings
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: '700' }}>
                    Cash Buying Power: {formatCur(portfolio?.availableBalance)}
                  </span>
                </div>
                
                {/* Portfolio summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255, 140, 0, 0.12)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Total Investment</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{formatCur(totalInvested)}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255, 140, 0, 0.12)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Current Value</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{formatCur(portfolio ? portfolio.currentValue : 0)}</div>
                  </div>
                  <div style={{ background: overallPL >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: '1px solid rgba(255, 140, 0, 0.12)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Total P&L</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: overallPL >= 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                      {overallPL >= 0 ? '+' : ''}{formatCur(overallPL)}
                    </div>
                  </div>
                  <div style={{ background: overallPL >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: '1px solid rgba(255, 140, 0, 0.12)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>P&L Percentage</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: overallPL >= 0 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                      {overallPL >= 0 ? '+' : ''}{overallPLPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <table className="trading-table">
                    <thead>
                      <tr>
                        <th>Stock Name</th>
                        <th>Buy Price</th>
                        <th>Current Price</th>
                        <th>Quantity</th>
                        <th>Total P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio?.holdings.map((holding) => {
                        const stockObj = stocks.find((s) => s._id === holding.stockId);
                        const currentPrice = stockObj ? stockObj.currentPrice : (holding.currentPrice || holding.averageBuyPrice);
                        const buyPrice = holding.averageBuyPrice;
                        const qty = holding.quantity;
                        const plVal = (currentPrice - buyPrice) * qty;
                        const plPercent = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
                        const isProfit = plVal >= 0;

                        const formattedPLVal = formatCur(plVal);
                        const formattedPercent = `${isProfit ? '+' : ''}${plPercent.toFixed(1)}%`;
                        const formattedPL = `${isProfit ? '+' : ''}${formattedPLVal} (${formattedPercent})`;

                        return (
                          <tr
                            key={holding._id}
                            onClick={() => {
                              if (stockObj) setSelectedStock(stockObj);
                            }}
                          >
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="symbol-badge" style={{ alignSelf: 'flex-start' }}>{holding.symbol}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                  {stockObj ? stockObj.companyName : holding.companyName}
                                </span>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCur(buyPrice)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCur(currentPrice)}</td>
                            <td style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{qty}</td>
                            <td style={{ fontWeight: '700', color: isProfit ? 'var(--color-success)' : 'var(--color-danger)', whiteSpace: 'nowrap' }}>
                              <span style={{ marginRight: '4px' }}>{isProfit ? '▲' : '▼'}</span>
                              {formattedPL}
                            </td>
                          </tr>
                        );
                      })}
                      {(!portfolio || portfolio.holdings.length === 0) && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                            No investments owned yet. Select an asset to purchase.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transactions History */}
              <div className="dashboard-section">
                <h3 className="section-title" style={{ marginBottom: '15px' }}>
                  Recent Activity Logs
                </h3>

                <div className="transaction-list" style={{ maxHeight: '200px' }}>
                  {transactions.slice(0, 10).map((t) => {
                    const isBuy = t.transactionType === 'BUY';
                    return (
                      <div key={t._id} className="transaction-item" style={{ padding: '10px 14px' }}>
                        <div className="transaction-item-left">
                          <span className={`transaction-type-badge ${isBuy ? 'buy' : 'sell'}`}>
                            {isBuy ? 'Bought' : 'Sold'}
                          </span>
                          <div>
                            <span className="mono-text" style={{ fontWeight: '700', color: '#fff' }}>{t.stockId?.symbol || 'STOCK'}</span>
                            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: '11px' }}>
                              {t.quantity} qty @ {formatCur(t.price)}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', fontSize: '12px', color: isBuy ? '#fff' : 'var(--color-success)' }}>
                            {isBuy ? '-' : '+'}{formatCur(t.totalAmount)}
                          </div>
                          <span className="transaction-date" style={{ fontSize: '9px' }}>
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      No transactions recorded.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>



          {/* Bottom Section: Info and Quick Guides */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '32px', marginTop: '10px' }}>
            <div className="dashboard-section" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>
                💡 Stock Market Beginner's Guide
              </h4>
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>🔹 <strong>What is a stock?</strong> When you buy a stock, you own a tiny piece of that company. If the company does well, the stock price usually rises.</div>
                <div>🔹 <strong>Diversification:</strong> Don't put all your eggs in one basket! Spread your money across different sectors (Tech, Finance, Retail) to minimize risk.</div>
                <div>🔹 <strong>High vs. Low price:</strong> A price closer to the daily low might indicate a discount, while a price near the daily high shows strong interest.</div>
              </div>
            </div>

            <div style={{ padding: '20px' }}></div>
          </div>

        </main>
      ) : (
        /* Admin View Portal (Preserved) */
        <main className="dashboard-main">
          <div className="admin-header">
            <h2 className="section-title" style={{ fontSize: '22px' }}>
              Control Settings Dashboard
            </h2>
            <div className="auth-tabs" style={{ marginBottom: '0' }}>
              <button
                onClick={() => setAdminTab('stocks')}
                className={`auth-tab-btn ${adminTab === 'stocks' ? 'active' : ''}`}
              >
                Stock Listing CRUD
              </button>
              <button
                onClick={() => setAdminTab('trades')}
                className={`auth-tab-btn ${adminTab === 'trades' ? 'active' : ''}`}
              >
                All Platform Trades
              </button>
            </div>
          </div>

          {adminTab === 'stocks' ? (
            <div className="admin-grid">
              {/* List of stocks */}
              <div className="dashboard-section">
                <h3 className="section-title" style={{ marginBottom: '20px' }}>
                  Manage Assets
                </h3>
                <div className="table-container">
                  <table className="trading-table">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>Sector</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock) => (
                        <tr key={stock._id}>
                          <td>
                            <span className="symbol-badge">{stock.symbol}</span>
                          </td>
                          <td style={{ fontWeight: '600' }}>{stock.companyName}</td>
                          <td>
                            <span className="sector-badge">{stock.sector}</span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                            {formatCur(stock.currentPrice)}
                          </td>
                          <td>
                            <div className="admin-stock-actions">
                              <button
                                onClick={() => handleEditStock(stock)}
                                className="admin-action-btn edit"
                                title="Edit Stock Properties"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteStock(stock._id)}
                                className="admin-action-btn delete"
                                title="Delete Stock Asset"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form to create/edit stock */}
              <div className="dashboard-section">
                <h3 className="section-title" style={{ marginBottom: '20px' }}>
                  {adminStockId ? 'Edit Stock Asset' : 'Launch New Stock Asset'}
                </h3>

                {adminError && <div className="auth-error">{adminError}</div>}

                <form onSubmit={handleAdminStockSubmit}>
                  <div className="form-group">
                    <label className="form-label">Ticker Symbol</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NFLX"
                      value={adminSymbol}
                      onChange={(e) => setAdminSymbol(e.target.value.toUpperCase())}
                      className="form-input"
                      disabled={!!adminStockId}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Netflix, Inc."
                      value={adminCompanyName}
                      onChange={(e) => setAdminCompanyName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Quote Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 610.50"
                      value={adminPrice}
                      onChange={(e) => setAdminPrice(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Market Capitalization ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 265000000000"
                      value={adminMarketCap}
                      onChange={(e) => setAdminMarketCap(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Sector</label>
                    <select
                      value={adminSector}
                      onChange={(e) => setAdminSector(e.target.value)}
                      className="sector-filter"
                      style={{ width: '100%', padding: '12px' }}
                    >
                      {sectorsList.filter(s => s !== 'All').map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary">
                      {adminStockId ? 'Save Changes' : 'Launch Asset'}
                    </button>
                    {adminStockId && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminStockId('');
                          setAdminSymbol('');
                          setAdminCompanyName('');
                          setAdminPrice('');
                          setAdminMarketCap('');
                          setAdminSector('Technology');
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Trades log for Admin */
            <div className="glass-panel-container" style={{ padding: '0' }}>
              <div className="dashboard-section">
                <h3 className="section-title" style={{ marginBottom: '20px' }}>
                  Platform Transactions Log
                </h3>
                <div className="table-container">
                  <table className="trading-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Trader Info</th>
                        <th>Type</th>
                        <th>Asset</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTransactions.map((t) => (
                        <tr key={t._id}>
                          <td>{new Date(t.createdAt).toLocaleString()}</td>
                          <td>
                            <div>{t.userId?.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {t.userId?.email}
                            </div>
                          </td>
                          <td>
                            <span className={`symbol-badge ${t.transactionType === 'BUY' ? 'green' : 'red'}`} style={{
                              background: t.transactionType === 'BUY' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                              color: t.transactionType === 'BUY' ? 'var(--color-success)' : 'var(--color-danger)',
                              borderColor: t.transactionType === 'BUY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                            }}>
                              {t.transactionType}
                            </span>
                          </td>
                          <td>
                            <span className="symbol-badge">{t.stockId?.symbol || 'STOCK'}</span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{t.quantity}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCur(t.price)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                            {formatCur(t.totalAmount)}
                          </td>
                        </tr>
                      ))}
                      {allTransactions.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                            No transactions have been recorded on the platform yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Watchlist sliding drawer */}
      <div className={`watchlist-drawer ${isWatchlistOpen ? 'open' : ''}`}>
        <div className="watchlist-drawer-header">
          <span className="watchlist-drawer-title">⭐ Bookmarked Stocks</span>
          <button onClick={() => setIsWatchlistOpen(false)} className="watchlist-drawer-close">
            &times;
          </button>
        </div>
        <div className="watchlist-drawer-content">
          {favorites.length === 0 ? (
            <div className="watchlist-drawer-empty">
              No bookmarked stocks yet. Click the star ★ next to any stock symbol to pin it here.
            </div>
          ) : (
            favorites.map((sym) => {
              const stock = stocks.find(s => s.symbol === sym);
              if (!stock) return null;
              
              const startPrice = stock.historicalPrices?.[0]?.price || stock.currentPrice;
              const chg = stock.currentPrice - startPrice;
              const pct = startPrice > 0 ? (chg / startPrice) * 100 : 0;
              const flashType = flashes[stock._id];

              return (
                <div 
                  key={stock._id} 
                  className={`watchlist-drawer-item ${flashType === 'up' ? 'flash-up' : flashType === 'down' ? 'flash-down' : ''}`}
                  onClick={() => {
                    setSelectedStock(stock);
                    setIsWatchlistOpen(false);
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="symbol-badge">{stock.symbol}</span>
                      <strong style={{ color: '#fff', fontSize: '13px' }}>{stock.companyName.split(' ')[0]}</strong>
                    </div>
                    <span className="sector-badge" style={{ marginTop: '6px', display: 'inline-block' }}>{stock.sector}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className={`price-indicator ${chg >= 0 ? 'up' : 'down'}`} style={{ fontSize: '14px' }}>
                        {formatCur(stock.currentPrice)}
                      </div>
                      <span style={{ fontSize: '11px', color: chg >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
                        {chg >= 0 ? '▲' : '▼'} {pct.toFixed(2)}%
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(stock.symbol);
                      }}
                      className="pin-btn pinned"
                      title="Unpin Bookmark"
                      style={{ margin: 0 }}
                    >
                      ★
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* News details popover modal */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <span className="modal-title" style={{ fontSize: '18px' }}>
                Market Coverage Details
              </span>
              <button onClick={() => setSelectedNews(null)} className="modal-close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', lineHeight: '1.4' }}>
                {selectedNews.title}
              </h3>
              
              <div className="article-metadata-row">
                <span>Source: <strong style={{ color: 'var(--color-accent)' }}>{selectedNews.source}</strong></span>
                <span>Published: <strong>{new Date(selectedNews.pubDate).toLocaleDateString()} {new Date(selectedNews.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
              </div>
              
              <div className="article-modal-summary">
                <strong>Simplified Summary:</strong> Google News RSS updates report major adjustments in market sectors affecting indices and corporate trade loops. Check the original coverage link below to read the complete article text.
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <a 
                  href={selectedNews.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-link-btn"
                  style={{ margin: 0 }}
                >
                  Visit Coverage Site ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade execution Drawer Modal (Preserved buy/sell exactly) */}
      {selectedStock && showTradeModal && (
        <div className="modal-overlay" onClick={() => setShowTradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="symbol-badge" style={{ fontSize: '14px', padding: '4px 10px' }}>
                  {selectedStock.symbol}
                </span>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{selectedStock.companyName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {selectedStock.sector} Sector
                  </div>
                </div>
              </div>
              <button onClick={() => setShowTradeModal(false)} className="modal-close-btn">
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Detailed metrics */}
              <div className="stock-stats-row">
                <div className="stock-stat-card">
                  <div className="stock-stat-label">Current Price</div>
                  <div 
                    className="stock-stat-value" 
                    style={{ 
                      color: selectedStock.historicalPrices && selectedStock.historicalPrices.length >= 2 && selectedStock.currentPrice >= selectedStock.historicalPrices[0].price
                        ? 'var(--color-success)'
                        : 'var(--color-danger)'
                    }}
                  >
                    {formatCur(selectedStock.currentPrice)}
                  </div>
                </div>
                <div className="stock-stat-card">
                  <div className="stock-stat-label">Daily High</div>
                  <div className="stock-stat-value">{formatCur(selectedStock.dailyHigh)}</div>
                </div>
                <div className="stock-stat-card">
                  <div className="stock-stat-label">Daily Low</div>
                  <div className="stock-stat-value">{formatCur(selectedStock.dailyLow)}</div>
                </div>
              </div>

              {/* Price trend chart */}
              <div className="chart-panel">
                <div className="chart-header">
                  <span className="chart-title">Hourly Quote History (Last 24h)</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: selectedStock.historicalPrices && selectedStock.historicalPrices.length >= 2 && selectedStock.historicalPrices[selectedStock.historicalPrices.length - 1].price >= selectedStock.historicalPrices[0].price
                        ? 'var(--color-success)'
                        : 'var(--color-danger)',
                    }}
                  >
                    {selectedStock.historicalPrices && selectedStock.historicalPrices.length >= 2 && selectedStock.historicalPrices[selectedStock.historicalPrices.length - 1].price >= selectedStock.historicalPrices[0].price
                      ? '▲ Growth trend'
                      : '▼ Downward trend'}
                  </span>
                </div>
                <canvas ref={canvasRef} className="chart-canvas" />
              </div>

              {/* Trade executing widget */}
              <div className="trade-form-widget">
                <div className="trade-toggle">
                  <button
                    onClick={() => { setTradeType('BUY'); setTradeError(''); setTradeSuccess(''); }}
                    className={`trade-toggle-btn buy ${tradeType === 'BUY' ? 'active' : ''}`}
                  >
                    Buy shares
                  </button>
                  <button
                    onClick={() => { setTradeType('SELL'); setTradeError(''); setTradeSuccess(''); }}
                    className={`trade-toggle-btn sell ${tradeType === 'SELL' ? 'active' : ''}`}
                  >
                    Sell shares
                  </button>
                </div>

                {tradeError && <div className="auth-error" style={{ marginBottom: '16px', fontSize: '12px', padding: '10px' }}>{tradeError}</div>}
                {tradeSuccess && (
                  <div
                    className="auth-error"
                    style={{
                      background: 'var(--color-success-bg)',
                      borderColor: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--color-success)',
                      marginBottom: '16px',
                      fontSize: '12px',
                      padding: '10px',
                    }}
                  >
                    {tradeSuccess}
                  </div>
                )}

                <form onSubmit={handleTradeSubmit}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontSize: '11px', margin: '0' }}>
                        Shares Quantity
                      </label>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', float: 'right' }}>
                        {tradeType === 'BUY'
                          ? `Buying Power: ${formatCur(portfolio?.availableBalance)}`
                          : `Owned shares: ${
                              portfolio?.holdings.find((h) => h.stockId === selectedStock._id)?.quantity || 0
                            }`}
                      </span>
                    </div>
                    <input
                      type="number"
                      required
                      value={tradeQty}
                      onChange={(e) => setTradeQty(e.target.value)}
                      className="form-input"
                      style={{ fontFamily: 'var(--font-mono)', padding: '10px 14px' }}
                    />
                    {tradeErrors.quantity && (
                      <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        {tradeErrors.quantity}
                      </span>
                    )}
                  </div>

                  <div className="trade-calc-row">
                    <span className="trade-calc-label">
                      Estimated {tradeType === 'BUY' ? 'Cost' : 'Revenue'}
                    </span>
                    <span
                      className="trade-calc-val"
                      style={{ color: tradeType === 'BUY' ? 'var(--color-accent)' : 'var(--color-success)' }}
                    >
                      {formatCur(selectedStock.currentPrice * (Number(tradeQty) || 0))}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={Object.keys(tradeErrors).length > 0}
                    className="btn"
                    style={{
                      background: Object.keys(tradeErrors).length > 0
                        ? 'var(--text-muted)'
                        : (tradeType === 'BUY' ? 'var(--color-success)' : 'var(--color-danger)'),
                      color: '#000',
                      fontWeight: '800',
                      marginTop: '20px',
                      cursor: Object.keys(tradeErrors).length > 0 ? 'not-allowed' : 'pointer',
                      opacity: Object.keys(tradeErrors).length > 0 ? 0.6 : 1,
                      boxShadow: Object.keys(tradeErrors).length > 0
                        ? 'none'
                        : (tradeType === 'BUY'
                            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                            : '0 4px 12px rgba(239, 68, 68, 0.2)'),
                    }}
                  >
                    Execute {tradeType} order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
