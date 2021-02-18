const cloudinary =  require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

exports.cloudinary = cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SCRECT,
});


