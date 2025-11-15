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

// All sweet routes require authentication
router.use(authenticate);

router.post(
  '/',
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Sweet name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  ],
  createSweet
);

router.get('/', getAllSweets);

router.get('/search', searchSweets);

router.put('/:id', upload.single('image'), updateSweet);

router.delete('/:id', authorizeAdmin, deleteSweet);

router.post('/:id/purchase', purchaseSweet);

router.post('/:id/restock', authorizeAdmin, restockSweet);

export default router;
