import { Schema } from 'mongoose';
import { SellerSchema } from './seller-schema';
import { ShippingSchema } from './shipping-schema';

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
    shipping: {
      type: ShippingSchema,
    },
  },
  {
    collection: 'Users',
    timestamps: true,
  },
);

export { UserSchema };
