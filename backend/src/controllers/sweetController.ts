import { Response } from 'express';
import { validationResult } from 'express-validator';
import Sweet from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sweet-shop',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
      return;
    }

    const { name, category, price, quantity, description } = req.body;

    let imageUrl: string | undefined;

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file);
      } catch (uploadError) {
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl,
    });

    res.status(201).json(sweet);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ error: messages[0] });
      return;
    }
    res.status(500).json({ error: 'Server error while creating sweet' });
  }
};

export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching sweets' });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Server error while searching sweets' });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Upload new image to Cloudinary if provided
    if (req.file) {
      try {
        updateData.imageUrl = await uploadToCloudinary(req.file);
      } catch (uploadError) {
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    const sweet = await Sweet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ error: messages[0] });
      return;
    }
    res.status(500).json({ error: 'Server error while updating sweet' });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting sweet' });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be a positive number' });
      return;
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    if (sweet.quantity < quantity) {
      res.status(400).json({ error: 'Insufficient quantity in stock' });
      return;
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Server error while purchasing sweet' });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be a positive number' });
      return;
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Server error while restocking sweet' });
  }
};
