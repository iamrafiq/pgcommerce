import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    seller: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    star: {
      type: Number,
      required: true,
      default: 0,
    },
    starCount: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
    features: [
      {
        featuresDescription: {
          type: String,
        },
        featuresValue: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
