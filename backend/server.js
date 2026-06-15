import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Stock from './models/Stock.js';
import { seedDatabaseIfNeeded } from './config/seedHelper.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);

// Real-Time Finance News RSS Parser
app.get('/api/news', async (req, res) => {
  try {
    const response = await fetch('https://news.google.com/rss/search?q=business+finance+stocks&hl=en-US&gl=US&ceid=US:en');
    if (!response.ok) {
      return res.status(500).json({ message: 'Failed to fetch news feed' });
    }
    const xmlText = await response.text();
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      const title = (itemContent.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
      const link = (itemContent.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
      const pubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
      const source = (itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';
      
      const clean = (str) => str
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .trim();

      let cleanTitle = clean(title);
      const cleanSource = clean(source);
      if (cleanSource && cleanTitle.endsWith(` - ${cleanSource}`)) {
        cleanTitle = cleanTitle.substring(0, cleanTitle.length - (cleanSource.length + 3)).trim();
      }

      items.push({
        title: cleanTitle,
        link: clean(link),
        pubDate: clean(pubDate),
        source: cleanSource
      });
    }

    res.json(items.slice(0, 15));
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: 'Error fetching financial news' });
  }
});

// Base route
app.get('/', (req, res) => {
  res.send('Stock Trading Simulation API is running...');
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Yahoo Finance Live Market Sync Service
const updateStockPricesFromYahoo = async () => {
  try {
    const stocks = await Stock.find({});
    if (stocks.length === 0) return;

    console.log(`Syncing ${stocks.length} assets with real-time Yahoo Finance feed...`);

    for (const stock of stocks) {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}?interval=1h&range=5d`);
        if (!response.ok) continue;

        const data = await response.json();
        const result = data.chart?.result?.[0];
        if (!result) continue;

        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice || stock.currentPrice;
        const dailyHigh = meta.regularMarketDayHigh || stock.dailyHigh;
        const dailyLow = meta.regularMarketDayLow || stock.dailyLow;
        
        // Build price charts from actual 24h history
        const timestamps = result.timestamp || [];
        const closes = result.indicators?.quote?.[0]?.close || [];
        
        const historicalPrices = [];
        for (let i = 0; i < Math.min(timestamps.length, closes.length); i++) {
          if (closes[i] !== null && closes[i] !== undefined) {
            historicalPrices.push({
              price: Number(closes[i].toFixed(2)),
              timestamp: new Date(timestamps[i] * 1000)
            });
          }
        }

        const sliceCount = historicalPrices.length > 30 ? historicalPrices.length - 30 : 0;
        const trimmedHistory = historicalPrices.slice(sliceCount);

        stock.currentPrice = Number(currentPrice.toFixed(2));
        stock.dailyHigh = Number(dailyHigh.toFixed(2));
        stock.dailyLow = Number(dailyLow.toFixed(2));
        if (trimmedHistory.length > 0) {
          stock.historicalPrices = trimmedHistory;
        }

        await stock.save();
      } catch (err) {
        console.error(`Error updating stock ${stock.symbol}:`, err.message);
      }
      // Delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    console.log('Sync with Yahoo Finance completed successfully.');
  } catch (error) {
    console.error('Error in Yahoo Finance sync service:', error.message);
  }
};

// Port configuration and startup
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabaseIfNeeded();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Run price update on boot, then schedule every 5 minutes
    updateStockPricesFromYahoo();
    setInterval(updateStockPricesFromYahoo, 300000);

    // Keep micro-fluctuations simulator running for active visual trading experience
    startPriceSimulator();
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

// Stock price simulator: Runs every 10 seconds in the background
const startPriceSimulator = () => {
  console.log('Stock Price Simulator started - Fluctuations occurring every 10s...');
  
  setInterval(async () => {
    try {
      const stocks = await Stock.find({});
      if (stocks.length === 0) return;

      for (const stock of stocks) {
        const fluctuationPercent = (Math.random() * 0.4 - 0.2) / 100; // tighter micro fluctuations (e.g. -0.2% to +0.2%)
        const oldPrice = stock.currentPrice;
        let newPrice = oldPrice * (1 + fluctuationPercent);
        
        if (newPrice < 1.0) {
          newPrice = 1.0;
        }

        newPrice = Number(newPrice.toFixed(2));
        
        stock.currentPrice = newPrice;
        
        if (newPrice > stock.dailyHigh) {
          stock.dailyHigh = newPrice;
        }
        if (newPrice < stock.dailyLow) {
          stock.dailyLow = newPrice;
        }

        stock.historicalPrices.push({
          price: newPrice,
          timestamp: new Date()
        });

        if (stock.historicalPrices.length > 50) {
          stock.historicalPrices.shift();
        }

        await stock.save();
      }
    } catch (error) {
      console.error('Error in Stock Price Simulator:', error.message);
    }
  }, 10000);
};

startServer();
