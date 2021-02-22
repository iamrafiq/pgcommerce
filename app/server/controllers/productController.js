const asyncHandler = require("express-async-handler");
const ProductUpload = require("../models/productUpload.js");
const Product = require("../models/productModel.js");
const formidable = require("formidable");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary.js");

// @Description add product
// @routes Post/api/product/upload
// @access Public
const initClientDir = () => {
  let temDir = `./tempDir`;
  if (!fs.existsSync(temDir)) {
    fs.mkdirSync(temDir);
  }
  return temDir;
};
exports.addProduct = asyncHandler(async (req, res) => {
  let form = new formidable.IncomingForm(); // all the form data will be available with the new incoming form
  form.keepExtensions = true; // what ever image type is getting extentions will be there
  form.uploadDir = initClientDir();
  let { fields, allFiles } = await new Promise(async function (
    resolve,
    reject
  ) {
    let allFiles = [];
    form
      .on("file", function (field, file) {
        allFiles.push({ field: field, file: file });
      })
      .on("end", function () {});

    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, allFiles });
    }); //
  });
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
  } = fields;

  console.log(cloudinary)
  let clResults = [];
  for (let i = 0; i < allFiles.length; i++) {
    if (allFiles[i].field === "photos") {
      clResults.push(
        await cloudinary.uploader.upload(allFiles[i].file.path, {
          upload_preset: "ml_default",
        })
      );
      fs.unlinkSync(allFiles[i].file.path, function (err) {
        console.log("error unlink", err);
      });
    }
  }
  if (clResults.length > 0) {
    const newUpload = new Product({
      name,
      category,
      photos: clResults.map((item, index) => item.secure_url),
      seller,
      price,
      shipping,
      features: [{ featuresDescription, featuresValue }],
      stock,
      description,
      description,
      cloudinary_id: clResults.map((item, index) => item.public_id),
    });
    newUpload
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        return res.status(400).json({
          error,
        });
      });
  } else {
    return res.status(400).json({
      error: "Required fileds are missing",
    });
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
