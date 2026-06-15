import Stock from '../models/Stock.js';

// @desc    Get all stocks with search and filter
// @route   GET /api/stocks
// @access  Public
export const getStocks = async (req, res) => {
  try {
    const { keyword, sector } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { symbol: { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (sector && sector !== 'All') {
      query.sector = sector;
    }

    const stocks = await Stock.find(query);
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single stock by ID
// @route   GET /api/stocks/:id
// @access  Public
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a stock
// @route   POST /api/stocks
// @access  Private/Admin
export const createStock = async (req, res) => {
  const { symbol, companyName, currentPrice, dailyHigh, dailyLow, marketCap, sector } = req.body;

  try {
    if (!symbol || !companyName || !currentPrice || !marketCap || !sector) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const stockExists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (stockExists) {
      return res.status(400).json({ message: 'Stock with this symbol already exists' });
    }

    // Set initial highs/lows if not provided
    const price = Number(currentPrice);
    const high = dailyHigh ? Number(dailyHigh) : price;
    const low = dailyLow ? Number(dailyLow) : price;

    const stock = new Stock({
      symbol: symbol.toUpperCase(),
      companyName,
      currentPrice: price,
      dailyHigh: high,
      dailyLow: low,
      marketCap: Number(marketCap),
      sector,
      historicalPrices: [{ price, timestamp: new Date() }],
    });

    const createdStock = await stock.save();
    res.status(201).json(createdStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a stock
// @route   PUT /api/stocks/:id
// @access  Private/Admin
export const updateStock = async (req, res) => {
  const { symbol, companyName, currentPrice, dailyHigh, dailyLow, marketCap, sector } = req.body;

  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      stock.symbol = symbol ? symbol.toUpperCase() : stock.symbol;
      stock.companyName = companyName || stock.companyName;
      
      if (currentPrice) {
        const oldPrice = stock.currentPrice;
        const newPrice = Number(currentPrice);
        stock.currentPrice = newPrice;
        
        // Update high/low
        if (newPrice > stock.dailyHigh) stock.dailyHigh = newPrice;
        if (newPrice < stock.dailyLow) stock.dailyLow = newPrice;
        
        // Log to history if price changed
        if (newPrice !== oldPrice) {
          stock.historicalPrices.push({ price: newPrice, timestamp: new Date() });
          // Limit history to last 50 entries
          if (stock.historicalPrices.length > 50) {
            stock.historicalPrices.shift();
          }
        }
      }

      stock.dailyHigh = dailyHigh ? Number(dailyHigh) : stock.dailyHigh;
      stock.dailyLow = dailyLow ? Number(dailyLow) : stock.dailyLow;
      stock.marketCap = marketCap ? Number(marketCap) : stock.marketCap;
      stock.sector = sector || stock.sector;

      const updatedStock = await stock.save();
      res.json(updatedStock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a stock
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      await Stock.deleteOne({ _id: stock._id });
      res.json({ message: 'Stock removed successfully' });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
