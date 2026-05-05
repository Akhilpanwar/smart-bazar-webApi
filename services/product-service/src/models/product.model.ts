import { boolean } from "joi";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  date: Date,
  reviewerName: String,
  reviewerEmail: String,
});

const dimensionsSchema = new mongoose.Schema({
  width: Number,
  height: Number,
  depth: Number,
});

const metaSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  barcode: String,
  qrCode: String,
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    categorySlug: {
      type: String,
    },
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,

    tags: [String],

    brand: String,
    sku: String,
    weight: Number,

    dimensions: dimensionsSchema,

    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,

    reviews: [reviewSchema],

    returnPolicy: String,
    minimumOrderQuantity: Number,

    meta: metaSchema,

    images: [String],

    thumbnail: String,
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
