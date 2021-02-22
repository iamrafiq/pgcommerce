const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    sku: {
      type: Number,
      required: true,
    },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      default: 30,
    },
    star: {
      type: Number,
      default: 0,
    },
    starCount: {
      type: Number,
      default: 0,
    },
    features: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    cloudinary_id: [
      {
        type: String,
      },
    ],
    features: [
      {
        imageUrl1: {
          type: String,
        },
        imageUrl2: {
          type: String,
        },
        imageUrl3: {
          type: String,
        },
        imageUrl4: {
          type: String,
        },
        imageUrl5: {
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

module.exports = mongoose.model("Product", productSchema);
