import express from 'express';
import {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} from '../controllers/stockController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getStocks)
  .post(protect, adminOnly, createStock);

router.route('/:id')
  .get(getStockById)
  .put(protect, adminOnly, updateStock)
  .delete(protect, adminOnly, deleteStock);

export default router;
