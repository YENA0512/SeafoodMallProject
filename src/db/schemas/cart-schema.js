import { Schema } from 'mongoose';

const CartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    cart_price: {
      type: Number,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'Carts',
    timestamps: true,
  },
);

export { CartSchema };
