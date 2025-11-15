import express from 'express';
import { body } from 'express-validator';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getAllSweets);
router.get('/search', searchSweets);

// Protected routes - require authentication
router.post(
  '/',
  authenticate,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Sweet name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  createSweet
);

router.put('/:id', authenticate, upload.single('image'), updateSweet);

router.post('/:id/purchase', authenticate, purchaseSweet);

// Admin-only routes (authorizeAdmin includes authentication check)
router.delete('/:id', authenticate, authorizeAdmin, deleteSweet);

router.post('/:id/restock', authenticate, authorizeAdmin, restockSweet);

export default router;
