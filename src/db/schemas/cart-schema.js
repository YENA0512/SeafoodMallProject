import { Schema } from 'mongoose';
import { ProductSchema } from './product-schema';

const CartSchema = new Schema(
  {
    product: {
      type: ProductSchema,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    _id: false,
  },
);

export { CartSchema };
