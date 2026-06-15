import Portfolio from '../models/Portfolio.js';
import Stock from '../models/Stock.js';

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Fetch all stocks to get current prices
    const stocks = await Stock.find({});
    const stockMap = stocks.reduce((acc, s) => {
      acc[s._id.toString()] = s;
      return acc;
    }, {});

    let totalInvestment = 0;
    let currentValue = 0;

    // Decorate holdings with current stock prices and calculate totals
    const decoratedHoldings = portfolio.holdings.map((holding) => {
      const stock = stockMap[holding.stockId.toString()];
      const livePrice = stock ? stock.currentPrice : holding.averageBuyPrice;
      const liveCompanyName = stock ? stock.companyName : holding.companyName;

      const costBasis = holding.quantity * holding.averageBuyPrice;
      const marketVal = holding.quantity * livePrice;
      const pl = marketVal - costBasis;

      totalInvestment += costBasis;
      currentValue += marketVal;

      // Return holding data decorated with live calculation values
      return {
        _id: holding._id,
        stockId: holding.stockId,
        symbol: holding.symbol,
        companyName: liveCompanyName,
        quantity: holding.quantity,
        averageBuyPrice: holding.averageBuyPrice,
        currentPrice: livePrice,
        totalInvestment: costBasis,
        currentValue: marketVal,
        profitLoss: pl,
      };
    });

    // Update totals in the portfolio model
    portfolio.totalInvestment = totalInvestment;
    portfolio.currentValue = currentValue;
    portfolio.profitLoss = currentValue - totalInvestment;

    await portfolio.save();

    res.json({
      _id: portfolio._id,
      userId: portfolio.userId,
      availableBalance: portfolio.availableBalance,
      holdings: decoratedHoldings,
      totalInvestment: portfolio.totalInvestment,
      currentValue: portfolio.currentValue,
      profitLoss: portfolio.profitLoss,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
