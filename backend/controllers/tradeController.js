import Stock from '../models/Stock.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
export const buyStock = async (req, res) => {
  const { stockId, quantity } = req.body;

  try {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for this user' });
    }

    const totalCost = stock.currentPrice * qty;

    // Check if user has enough virtual cash
    if (portfolio.availableBalance < totalCost) {
      return res.status(400).json({
        message: `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${portfolio.availableBalance.toFixed(2)}`,
      });
    }

    // Deduct cash balance
    portfolio.availableBalance -= totalCost;

    // Find if stock is already held
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId.toString()
    );

    if (holdingIndex >= 0) {
      const holding = portfolio.holdings[holdingIndex];
      const existingQty = holding.quantity;
      const existingAvgPrice = holding.averageBuyPrice;

      // Recalculate average buy price
      holding.averageBuyPrice =
        (existingQty * existingAvgPrice + totalCost) / (existingQty + qty);
      holding.quantity += qty;
    } else {
      // Add as new holding
      portfolio.holdings.push({
        stockId,
        symbol: stock.symbol,
        companyName: stock.companyName,
        quantity: qty,
        averageBuyPrice: stock.currentPrice,
      });
    }

    // Save portfolio
    await portfolio.save();

    // Create Transaction log
    const transaction = await Transaction.create({
      userId: req.user._id,
      stockId,
      transactionType: 'BUY',
      quantity: qty,
      price: stock.currentPrice,
      totalAmount: totalCost,
    });

    res.status(200).json({
      message: `Successfully purchased ${qty} shares of ${stock.symbol}`,
      transaction,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
export const sellStock = async (req, res) => {
  const { stockId, quantity } = req.body;

  try {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found for this user' });
    }

    // Find holding
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stockId.toString() === stockId.toString()
    );

    if (holdingIndex === -1) {
      return res.status(400).json({ message: `You do not own any shares of ${stock.symbol}` });
    }

    const holding = portfolio.holdings[holdingIndex];

    // Check if user has enough shares
    if (holding.quantity < qty) {
      return res.status(400).json({
        message: `Insufficient shares. Attempting to sell ${qty}, but you only own ${holding.quantity} shares`,
      });
    }

    const totalRevenue = stock.currentPrice * qty;

    // Add revenue to cash balance
    portfolio.availableBalance += totalRevenue;

    // Deduct shares from holding
    holding.quantity -= qty;

    // If quantity is zero, remove the holding entirely
    if (holding.quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    // Save portfolio
    await portfolio.save();

    // Create Transaction log
    const transaction = await Transaction.create({
      userId: req.user._id,
      stockId,
      transactionType: 'SELL',
      quantity: qty,
      price: stock.currentPrice,
      totalAmount: totalRevenue,
    });

    res.status(200).json({
      message: `Successfully sold ${qty} shares of ${stock.symbol}`,
      transaction,
      portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
