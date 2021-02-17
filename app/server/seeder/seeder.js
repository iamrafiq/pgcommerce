import mongoose from "mongoose";
import dotenv from "dotenv";
import "colors";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import products from "../data/index.js";
import users from "../data/users.js";
import connectDB from "../config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    await User.insertMany(users);

    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
  }
};

const destroyedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
  }
};

// It -d means delete data

if (process.argv[2] === "-d") {
  destroyedData();
} else {
  importData();
}
