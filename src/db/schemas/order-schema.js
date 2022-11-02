import { Schema } from 'mongoose';
import { CartSchema } from './cart-schema';
import { UserSchema } from './user-schema';

const OrderSchema = new Schema(
  {
    order_items: {
      type: [CartSchema],
      required: true,
    },
    customer: {
      type: UserSchema,
      required: true,
    },
    order_status: {
      type: String,
      enum: ['order', 'prepare', 'shipping', 'complete'],
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: 'Orders',
    timestamps: true,
  },
);

export { OrderSchema };
