import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  sweet: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  sweet: {
    type: Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user can have only one cart
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICart>('Cart', cartSchema);
