const asyncHandler = require ("express-async-handler");
const ProductUpload = require ("../models/productUpload.js");
const Product = require ("../models/productModel.js");

const cloudinary = require ("../utils/cloudinary.js");

// @Description add product
// @routes Post/api/product/upload
// @access Public

 exports.addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    img,
    seller,
    price,
    shipping,
    featuresDescription,
    featuresValue,
    stock,
    description,
  } = req.body;

  const result = await cloudinary.uploader.upload(img, {
    upload_preset: "ml_default",
  });
  if (result) {
    const newUpload = new Product({
      name,
      category,
      img: result.secure_url,
      seller,
      price,
      shipping,
      features: [{ featuresDescription, featuresValue }],
      stock,
      description,
      description,
      cloudinary_id: result.public_id,
    });
    const createNewUpload = await newUpload.save();
    res.status(201).json(createNewUpload);
  }
});

// @Description get product
// @routes Post/api/product/get
// @access Public

exports.getAllProducts = asyncHandler(async (req, res) => {
  const getProducts = await Product.find({});

  if (getProducts) {
    res.status(201).json(getProducts);
  } else {
    res.status(500);
    throw new Error("Some thing went wrong");
  }
});

// @Description get product by id
// @routes Post/api/product/upload/:id
// @access Public

exports.getProductById = asyncHandler(async (req, res) => {
  const findProduct = await Product.findById(req.params.id);

  if (findProduct) {
    res.status(201).json(findProduct);
  } else {
    res.status(404);
    throw new Error("Product is not found");
  }
});

// @Description updated product
// @routes Post/api/product/update
// @access Public

exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    img,
    seller,
    price,
    shipping,
    featuresDescription,
    featuresValue,
    stock,
    description,
  } = req.body;

  const products = await Product.findById(req.params.id);

  if (products) {
    products.name = name;
    products.category = category;
    products.img = img;
    products.seller = seller;
    products.price = price;
    products.stock = stock;
    products.shipping = shipping;
    products.features = [{ featuresDescription, featuresValue }];
    products.description = description;
    if (img.startsWith("data:image/")) {
      const result = await cloudinary.uploader.upload(img, {
        upload_preset: "ml_default",
      });
      products.img = result.secure_url;
    } else {
      products.img = img;
    }

    const updatedProduct = await products.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/product/delete/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const products = await Product.findById(req.params.id);

  if (products) {
    await products.remove();
    await cloudinary.uploader.destroy(products.cloudinary_id);
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
