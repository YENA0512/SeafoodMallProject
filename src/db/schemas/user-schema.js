import { Schema } from 'mongoose';
import { SellerSchema } from './seller-schema';
import { ShippingSchema } from './shipping-schema';
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
      default: null,
    },
    seller_info: SellerSchema,
    shipping: ShippingSchema,
    // cart: [CartSchema],
  },
  {
    collection: 'Users',
    timestamps: true,
  },
);

export { UserSchema };
