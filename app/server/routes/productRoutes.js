import express from "express";
import {
  addProduct,
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.post("/upload", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
