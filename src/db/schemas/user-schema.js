import { Schema } from 'mongoose';
import { SellerSchema } from './seller-schema';
// import { CartSchema } from './cart-schema';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      enum: ['admin', 'seller', 'customer'],
      default: 'customer',
      required: true,
    },
    deleted_at: {
      type: Date,
    },
    seller_info: SellerSchema,
    // cart: [CartSchema],
  },
  {
    collection: 'Users',
    timestamps: true,
  },
);

export { UserSchema };
