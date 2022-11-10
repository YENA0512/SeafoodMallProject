import { Schema } from 'mongoose';

const ShippingSchema = new Schema(
  {
    // user_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    //   unique: true,
    // },
    // place_name: {
    //   type: String,
    //   required: true,
    //   index: true,
    //   default: null,
    // },
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
      default: null,
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
