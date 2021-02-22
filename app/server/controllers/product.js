const db = require("../models/index");
const { success, failed } = require("./responce");

exports.create = async (req, res, next) => {
  console.log(req.body)
  const t = await db.sequelize.transaction();
  try {
    const product = await db.Product.create(
      {
        ...req.body,
      },
      { transaction: t }
    );
    console.log("product crated")
    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        const translation = await db.ProductTranslation.create(
          {
            ...translations[i],
            productId: product.id,
          },
          { transaction: t }
        );
        console.log("trans", i)
        translationsArray.push(translation);
      }
    }
    await t.commit();
    const { id, ...rest } = product.dataValues;
    const activeFiles = [];
    const { photos, offerPhotos } = req.body;
    if (photos && photos.length > 0) {
      photos.map(item=>  activeFiles.push({
        genre: "product",
        componentUUID: product.uuid,
        componentSlug: product.slug,
        componentField: "photos",
        url: item,
      }));
    
    }
    if (offerPhotos && offerPhotos.length > 0) {
      offerPhotos.map(item=>  activeFiles.push({
        genre: "product",
        componentUUID: product.uuid,
        componentSlug: product.slug,
        componentField: "offerPhotos",
        url: item,
      }));
    
    }
    req.activeFiles = activeFiles;
    req.responce = {
      success: true,
      code: 200,
      message: "Product created successfully.",
      results: {
        ...rest,
        translations: [...translationsArray],
      },
    };
    next();
  } catch (error) {
    await t.rollback();
    req.responce = {
      success: false,
      message: "Unable to create product.",
      error,
    };
    next();
  }
};

exports.update = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const product = await db.Product.update(
      { ...req.body },
      {
        where: {
          id: req.product.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );
    const { dataValues } = product[1];

    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        if (translations[i].uuid) {
          const trans = await db.ProductTranslation.findOne({
            where: { uuid: translations[i].uuid },
          });

          if (trans !== null) {
            // updating
            console.log(trans);
            const translation = await db.ProductTranslation.update(
              { ...translations[i] },
              {
                where: {
                  id: trans.id,
                },
                returning: true,
                plain: true,
              },
              { transaction: t }
            );
            translationsArray.push(translation[1]);
          } else {
            // creating new row
            const translation = await db.ProductTranslation.create(
              {
                ...translations[i],
                productId: req.product.id,
              },
              { transaction: t }
            );
            translationsArray.push(translation);
          }
        } else {
          // creating new row
          const translation = await db.ProductTranslation.create(
            {
              ...translations[i],
              productId: req.product.id,
            },
            { transaction: t }
          );
          translationsArray.push(translation);
        }
      }
    }
    
    await t.commit();

    const { id, ...rest } = dataValues;
    const activeFiles = [];
    const inactiveFiles = [];
    const { photos, offerPhotos } = req.body;
    if (photos && photos.length > 0) {
      photos.map(item=>  activeFiles.push({
        genre: "product",
        componentUUID: product.uuid,
        componentSlug: product.slug,
        componentField: "photos",
        url: item,
      }));
    }
    if (req.product.photos && req.product.photos.length>0) {
      req.product.photos.map(item=>  inactiveFiles.push(item));
    }

    if (offerPhotos && offerPhotos.length > 0) {
      offerPhotos.map(item=>  activeFiles.push({
        genre: "product",
        componentUUID: product.uuid,
        componentSlug: product.slug,
        componentField: "photos",
        url: item,
      }));
    }
    if (req.product.offerPhotos && req.product.offerPhotos.length>0) {
      req.product.offerPhotos.map(item=>  inactiveFiles.push(item));
    }

    req.activeFiles = activeFiles;
    req.inactiveFiles = inactiveFiles;

    req.responce = {
      success: true,
      code: 200,
      message: "Product updated successfully.",
      results: {
        ...rest,
        translations: [...translationsArray],
      },
    };
    next();
  } catch (error) {
    await t.rollback();
    req.responce = {
      success: false,
      message: "Unable to update product.",
      error,
    };
    next();
  }
};

exports.productByUUID = async (req, res, next, uuid) => {
  try {
    const product = await db.Product.findOne({ where: { uuid } });
    if (product === null) {
      failed(
        res,
        `Unable to find product by UUID. ${uuid}`,
        (error = { name: "not_found" })
      );
    } else {
      req.product = product;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find product by UUID. ${uuid}`, error);
  }
};
exports.translationByUUID = async (req, res, next, uuid) => {
  try {
    const translation = await db.ProductTranslation.findOne({
      where: { uuid },
    });
    if (translation === null) {
      failed(
        res,
        `Unable to find translation by UUID. ${uuid}`,
        (error = { name: "not_found" })
      );
    } else {
      req.translation = translation;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find translation by UUID. ${uuid}`, error);
  }
};

exports.productBySlug = async (req, res, next, slug) => {
  try {
    const product = await db.Product.findOne({ where: { slug: slug } });
    if (product === null) {
      failed(
        res,
        `Unable to find product by slug. ${slug}`,
        (error = { name: "not_found" })
      );
    } else {
      req.product = product;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find product by slug. ${slug}`, error);
  }
};

exports.read = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product retrieve successfully.",
    results: req.product,
  });
};
exports.softRemove = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const product = await db.Product.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          id: req.product.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );

    const { dataValues } = product[1];
    const translations = await db.ProductTranslation.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          productId: req.product.id,
        },
        returning: true,
      },
      { transaction: t }
    );

    await t.commit();
    const { id, ...rest } = dataValues;
    req.responce = {
      success: true,
      code: 200,
      message: "Product softly deleted.",
      results: {
        ...rest,
        translations: translations[1],
      },
    };
    next();
  } catch (error) {
    await t.rollback();
    req.responce = {
      success: false,
      message: "Unable apply soft delete operation on product.",
      error,
    };
    next();
  }
};
exports.reactivate = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  const { id } = req.product;
  console.log(req.product)
  try {
    const product = await db.Product.update(
      { deletedAt: null },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );

    const { dataValues } = product[1];

    const translations = await db.ProductTranslation.update(
      { deletedAt: null },
      {
        where: {
          productId: id,
        },
        returning: true,
      },
      { transaction: t }
    );
    await t.commit();
    req.responce = {
      success: true,
      code: 200,
      message: "Product reactivate successfully.",
      results: {
        ...dataValues,
        translations: translations[1],
      },
    };
    next();
  } catch (error) {
    await t.rollback();
    req.responce = {
      success: false,
      message: "Unable to reactivate product.",
      error,
    };
    next();
  }
};
exports.reactivateTranslation = async (req, res) => {
  const { id } = req.translation;
  try {
    const translation = await db.ProductTranslation.update(
      { deletedAt: null },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );
    const { dataValues } = translation[1];
    success(res, 200, "Product translation reactivate successfully.", {
      ...dataValues,
    });
    req.responce = {
      success: true,
      code: 200,
      message: "Product translation reactivate successfully.",
      results: {
        ...dataValues,
      },
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to reactivate product translation.",
      error,
    };
    next();
  }
};
exports.hardRemove = async (req, res, next) => {
  try {
    await db.Product.destroy({
      where: {
        id: req.product.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: `product ${req.product.slug} deleted parmanently.`,
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete product.",
      error,
    };
    next();
  }
};
exports.hardRemoveTranslation = async (req, res, next) => {
  try {
    await db.ProductTranslation.destroy({
      where: {
        id: req.translation.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: "Product Translation deleted parmanently.",
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete product translation.",
      error,
    };
    next();
  }
};
const Sequelize = require('sequelize');
const op = Sequelize.Op;


exports.list = async (req, res, next) => {
  let {
    limit,
    offset,
    name, // product name
    priceFrom,
    priceTo,
    categories,
    brands,
  } = req.query;
  limit = limit ? parseInt(limit) : 100;
  offset = offset ? parseInt(offset) : 0;
  let categoryOptions = categories?{categoryUUID: {[db.Sequelize.Op.in]: JSON.parse(categories)}}:{};
  let brandOptions = brands?{brandUUID: {[db.Sequelize.Op.in]: JSON.parse(brands)}}:{};
  let priceFromOption = priceFrom ? {
    unitPrice: {
      [db.Sequelize.Op.gte]: priceFrom
    }
  }:{};
  let priceToOption = priceTo ? {
    unitPrice: {
      [db.Sequelize.Op.lte]: priceTo
    }
  }:{};

  try {
    var productIds;
    if (name){
      let productTrans = await db.ProductTranslation.findAll({
        where: {
          name: {
            [db.Sequelize.Op.like]: `%${name}%`
          }
        },
       
      });
      if (productTrans.length > 0){
        productIds=[];
        for(let i = 0; i < productTrans.length; i++){
          productIds.push(productTrans[i].dataValues.productId);
      }
      }else{
        productIds = undefined;
      }
       
    }else{
      productIds=undefined;
    }    
  
    let productNameOptions = productIds?{id: {[db.Sequelize.Op.in]: productIds}}:{};

    const products = await db.Product.findAll({
      attributes: { exclude: ["delatedAt"] },
      where: db.Sequelize.and({ deletedAt: null }, categoryOptions, brandOptions, priceFromOption, priceToOption, productNameOptions),
      include: [
        {
          model: db.ProductTranslation,
          as: "translations",
          // where: { code: "en-US" }, //{code: "en-US"}, {isDefault: true}
          where: db.Sequelize.and({ code: "en-US" }, { deletedAt: null }),
        },
      ],
    });
    if (products === null || products.length <= 0) {
      req.responce = {
        success: false,
        message: "Products not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All products retrieve successfully.",
        results: products,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "Products not found.",
      error,
    };
    next();
  }
};
exports.listWithAllTranslation = async (req, res, next) => {
  try {
    const products = await db.Product.findAll({
      include: [{ model: db.ProductTranslation, as: "translations" }],
    });
    if (products === null || products.length <= 0) {
      req.responce = {
        success: false,
        message: "products not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All products retrieve successfully.",
        results: products,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "Products not found.",
      error,
    };
    next();
  }
};
