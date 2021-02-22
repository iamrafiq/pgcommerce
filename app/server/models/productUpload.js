const mongoose = require("mongoose");

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

module.exports =mongoose.model("productUpload", productUploadSchema);
