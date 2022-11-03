import { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    parent_category: {
      type: String,
      required: true,
    },
    child_category: {
      type: String,
      required: true,
    },
    species: {
      type: String,
    },
    species_code: {
      type: Number,
    },
    species_image: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: 'Categories',
    timestamps: true,
  },
);

export { CategorySchema };
