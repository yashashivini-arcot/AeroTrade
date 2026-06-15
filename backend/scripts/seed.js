import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('Seeding started: Clearing existing collections...');
    
    // Clear existing data
    await User.deleteMany({});
    await Stock.deleteMany({});
    await Portfolio.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log('Collections cleared.');

    // Seed Stocks with mock historical data (15 points for chart visualization)
    const initialStocks = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        currentPrice: 175.25,
        sector: 'Technology',
        marketCap: 2720000000000,
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        currentPrice: 150.10,
        sector: 'Technology',
        marketCap: 1880000000000,
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        currentPrice: 420.30,
        sector: 'Technology',
        marketCap: 3120000000000,
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla, Inc.',
        currentPrice: 180.50,
        sector: 'Automotive',
        marketCap: 575000000000,
      },
      {
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        currentPrice: 950.00,
        sector: 'Technology',
        marketCap: 2370000000000,
      },
      {
        symbol: 'AMZN',
        companyName: 'Amazon.com, Inc.',
        currentPrice: 178.40,
        sector: 'Retail',
        marketCap: 1850000000000,
      },
      {
        symbol: 'NFLX',
        companyName: 'Netflix, Inc.',
        currentPrice: 610.75,
        sector: 'Entertainment',
        marketCap: 2650000000000,
      },
      {
        symbol: 'META',
        companyName: 'Meta Platforms, Inc.',
        currentPrice: 485.50,
        sector: 'Technology',
        marketCap: 1240000000000,
      },
      {
        symbol: 'JPM',
        companyName: 'JPMorgan Chase & Co.',
        currentPrice: 195.20,
        sector: 'Finance',
        marketCap: 560000000000,
      },
      {
        symbol: 'V',
        companyName: 'Visa Inc.',
        currentPrice: 275.60,
        sector: 'Finance',
        marketCap: 540000000000,
      },
      {
        symbol: 'AMD',
        companyName: 'Advanced Micro Devices, Inc.',
        currentPrice: 170.50,
        sector: 'Technology',
        marketCap: 275000000000,
      },
      {
        symbol: 'NKE',
        companyName: 'NIKE, Inc.',
        currentPrice: 98.60,
        sector: 'Retail',
        marketCap: 148000000000,
      },
      {
        symbol: 'DIS',
        companyName: 'The Walt Disney Company',
        currentPrice: 115.30,
        sector: 'Entertainment',
        marketCap: 210000000000,
      },
      {
        symbol: 'GS',
        companyName: 'The Goldman Sachs Group, Inc.',
        currentPrice: 412.80,
        sector: 'Finance',
        marketCap: 138000000000,
      },
      {
        symbol: 'F',
        companyName: 'Ford Motor Company',
        currentPrice: 12.40,
        sector: 'Automotive',
        marketCap: 50000000000,
      },
      {
        symbol: 'WMT',
        companyName: 'Walmart Inc.',
        currentPrice: 60.20,
        sector: 'Retail',
        marketCap: 485000000000,
      },
      {
        symbol: 'SONY',
        companyName: 'Sony Group Corporation',
        currentPrice: 85.40,
        sector: 'Entertainment',
        marketCap: 105000000000,
      },
    ];

    const seededStocks = [];

    for (const stockInfo of initialStocks) {
      const priceHistory = [];
      let lastPrice = stockInfo.currentPrice;
      const points = 15;
      
      // Generate historical prices backward
      for (let i = points; i >= 0; i--) {
        const offsetPercent = (Math.random() * 4 - 2) / 100; // -2% to +2%
        lastPrice = lastPrice * (1 - offsetPercent);
        priceHistory.push({
          price: Number(lastPrice.toFixed(2)),
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000), // Hourly increments
        });
      }
      
      const prices = priceHistory.map(p => p.price);
      const minPrice = Math.min(...prices, stockInfo.currentPrice);
      const maxPrice = Math.max(...prices, stockInfo.currentPrice);

      const newStock = new Stock({
        ...stockInfo,
        dailyLow: Number(minPrice.toFixed(2)),
        dailyHigh: Number(maxPrice.toFixed(2)),
        historicalPrices: priceHistory,
      });

      const savedStock = await newStock.save();
      seededStocks.push(savedStock);
    }

    console.log(`${seededStocks.length} stocks seeded successfully.`);

    // Seed Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@trading.com',
      password: 'admin123',
      role: 'ADMIN',
    });

    // Create empty portfolio for Admin
    await Portfolio.create({
      userId: adminUser._id,
      availableBalance: 100000.0,
      holdings: [],
    });

    // Seed Regular User
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@trading.com',
      password: 'password123',
      role: 'USER',
    });

    // Create custom portfolio for Regular User with some pre-owned holdings
    const jpmStock = seededStocks.find(s => s.symbol === 'JPM');
    const aaplStock = seededStocks.find(s => s.symbol === 'AAPL');
    const msftStock = seededStocks.find(s => s.symbol === 'MSFT');

    const holdings = [
      {
        stockId: jpmStock._id,
        symbol: jpmStock.symbol,
        companyName: jpmStock.companyName,
        quantity: 50,
        averageBuyPrice: 190.00, // bought slightly cheaper than current
      },
      {
        stockId: aaplStock._id,
        symbol: aaplStock.symbol,
        companyName: aaplStock.companyName,
        quantity: 100,
        averageBuyPrice: 172.50,
      },
      {
        stockId: msftStock._id,
        symbol: msftStock.symbol,
        companyName: msftStock.companyName,
        quantity: 20,
        averageBuyPrice: 425.00,
      }
    ];

    const totalInvestment = holdings.reduce((sum, h) => sum + (h.quantity * h.averageBuyPrice), 0);
    const currentValue = holdings.reduce((sum, h) => {
      const stock = seededStocks.find(s => s._id.toString() === h.stockId.toString());
      return sum + (h.quantity * (stock ? stock.currentPrice : h.averageBuyPrice));
    }, 0);

    const userPortfolio = await Portfolio.create({
      userId: regularUser._id,
      availableBalance: 75000.0, // Used some cash ($25,000 spent out of $100,000)
      holdings,
      totalInvestment,
      currentValue,
      profitLoss: currentValue - totalInvestment,
    });

    // Add some transaction logs for the pre-owned holdings
    await Transaction.create([
      {
        userId: regularUser._id,
        stockId: aaplStock._id,
        transactionType: 'BUY',
        quantity: 100,
        price: 172.50,
        totalAmount: 17250.00,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: regularUser._id,
        stockId: jpmStock._id,
        transactionType: 'BUY',
        quantity: 50,
        price: 190.00,
        totalAmount: 9500.00,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: regularUser._id,
        stockId: msftStock._id,
        transactionType: 'BUY',
        quantity: 20,
        price: 425.00,
        totalAmount: 8500.00,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      }
    ]);

    console.log('Default users, portfolios and transaction logs seeded successfully.');
    console.log('Regular User Creds: user@trading.com / password123');
    console.log('Admin User Creds: admin@trading.com / admin123');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
