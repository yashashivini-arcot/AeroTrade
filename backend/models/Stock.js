import mongoose from 'mongoose';

const historicalPriceSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Please add a stock symbol'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    currentPrice: {
      type: Number,
      required: [true, 'Please add the current price'],
    },
    dailyHigh: {
      type: Number,
      required: [true, 'Please add the daily high'],
    },
    dailyLow: {
      type: Number,
      required: [true, 'Please add the daily low'],
    },
    marketCap: {
      type: Number,
      required: [true, 'Please add the market cap'],
    },
    sector: {
      type: String,
      required: [true, 'Please add the stock sector'],
    },
    historicalPrices: [historicalPriceSchema],
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
