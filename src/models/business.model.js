
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const offerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const businessSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    products: {
      type: [productSchema],
      default: [],
    },
    offers: {
      type: [offerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;
