import mongoose from "mongoose";

const productUploadSchema = mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const productUpload = mongoose.model("productUpload", productUploadSchema);

export default productUpload;
