import { Schema } from 'mongoose';

const SellerSchema = new Schema(
  {
    seller_image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export { SellerSchema };
