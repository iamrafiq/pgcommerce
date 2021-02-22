const express = require("express");
const {
  addProduct,
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProduct,
}  = require( "../controllers/productController.js");

const router = express.Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById);
router.post("/upload", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;  