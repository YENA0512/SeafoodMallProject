import { Schema } from 'mongoose';
import { CategorySchema } from './category-schema';
import { UserSchema } from './user-schema';
import { PriceSchema } from './price-schema';

const ProductSchema = new Schema(
  {
    category: {
      type: CategorySchema,
      required: true,
    },
    seller: {
      type: UserSchema,
      //   // required: true,
    },
    price: {
      type: PriceSchema,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'Products',
    timestamps: true,
  },
);

export { ProductSchema };
