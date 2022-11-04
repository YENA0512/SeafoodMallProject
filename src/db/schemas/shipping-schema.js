import { Schema } from 'mongoose';

const ShippingSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    place_name: {
      type: String,
      required: true,
      index: true,
    },
    zencode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    address_type: {
      type: String,
      enum: ['R', 'J'],
      required: true,
    },
    detail_address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
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
