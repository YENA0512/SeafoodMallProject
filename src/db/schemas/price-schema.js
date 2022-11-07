import { Schema } from 'mongoose';

const PriceSchema = new Schema(
  {
    auction_cost: {
      type: Number,
      required: true,
    },
    seller_commision: {
      type: Number,
      required: true,
    },
    platform_commision: {
      type: Number,
      required: true,
    },
    packaging_cost: {
      type: Number,
      required: true,
    },
    shipping_cost: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export { PriceSchema };
