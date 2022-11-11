import { Schema } from 'mongoose';
import { CartSchema } from './cart-schema';
import { UserSchema } from './user-schema';
import { orderStatus } from '../../utils/order-status';
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
      enum: [
        orderStatus.ORDER,
        orderStatus.PREPARE,
        orderStatus.SHIPPING,
        orderStatus.COMPLETE,
        orderStatus.CANCEL,
      ],
      required: true,
      default: 'order',
    },
    order_price: {
      type: Number,
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'Orders',
    timestamps: true,
  },
);

export { OrderSchema };
