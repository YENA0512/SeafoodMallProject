import { Schema } from 'mongoose';
import { ProductSchema } from './product-schema';

const CartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    product: {
      type: ProductSchema,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
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
