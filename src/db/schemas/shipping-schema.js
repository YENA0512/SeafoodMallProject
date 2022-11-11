import { Schema } from 'mongoose';

const ShippingSchema = new Schema(
  {
    zencode: {
      type: String,
      required: true,
      default: null,
    },
    address: {
      type: String,
      required: true,
      default: null,
    },
    address_type: {
      type: String,
      enum: ['R', 'J'],
      required: true,
      default: 'R',
    },
    detail_address: {
      type: String,
      required: true,
      default: null,
    },
    name: {
      type: String,
      required: true,
      default: null,
    },
    mobile: {
      type: String,
      required: true,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'Shippings',
    _id: false,
    timestamps: true,
  },
);

export { ShippingSchema };
