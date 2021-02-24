const db = require("../models/index");
const { success, failed } = require("./responce");

exports.create = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const brand = await db.Brand.create(
      {
        ...req.body,
      },
      { transaction: t }
    );
    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        const translation = await db.BrandTranslation.create(
          {
            ...translations[i],
            brandId: brand.id,
          },
          { transaction: t }
        );
        translationsArray.push(translation);
      }
    }
    await t.commit();
    const activeFiles = [];
    const { icon, thumbnail } = req.body;
    if (icon) {
      activeFiles.push({
        genre: "brand",
        componentUUID: brand.uuid,
        componentSlug: brand.slug,
        componentField: "icon",
        url: icon,
      });
    }
    if (thumbnail) {
      activeFiles.push({
        genre: "brand",
        componentUUID: brand.uuid,
        componentSlug: brand.slug,
        componentField: "thumbnail",
        url: thumbnail,
      });
    }
    req.activeFiles = activeFiles;
    req.responce = {
      success: true,
      code: 200,
      message: "Brand created successfully.",
      results: {
        ...brand.dataValues,
        translations: [...translationsArray],
      },
    };
    next();
  } catch (error) {
    await t.rollback();
    req.responce = {
      success: false,
      message: "Unable to create brand.",
      error,
    };
    next();
  }
};

exports.update = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const brand = await db.Brand.update(
      { ...req.body },
      {
        where: {
          id: req.brand.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );
    const { dataValues } = brand[1];

    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        if (translations[i].uuid) {
          const trans = await db.BrandTranslation.findOne({
            where: { uuid: translations[i].uuid },
          });

          if (trans !== null) {
            // updating
            const translation = await db.BrandTranslation.update(
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
            const translation = await db.BrandTranslation.create(
              {
                ...translations[i],
                brandId: req.brand.id,
              },
              { transaction: t }
            );
            translationsArray.push(translation);
          }
        } else {
          // creating new row
          const translation = await db.BrandTranslation.create(
            {
              ...translations[i],
              brandId: req.brand.id,
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
    const { icon, thumbnail } = req.body;
    if (!req.brand.icon) {
      if (icon) {
        activeFiles.push({
          genre: "brand",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "icon",
          url: icon,
        });
      }
    } else {
      if (icon && icon !== req.brand.icon) {
        activeFiles.push({
          genre: "brand",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "icon",
          url: icon,
        });
        inactiveFiles.push(req.brand.icon);
      }
    }
    if (!req.brand.thumbnail) {
      if (thumbnail) {
        activeFiles.push({
          genre: "brand",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "thumbnail",
          url: thumbnail,
        });
      }
    } else {
      if (thumbnail && thumbnail !== req.brand.thumbnail) {
        activeFiles.push({
          genre: "brand",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "thumbnail",
          url: thumbnail,
        });
        inactiveFiles.push(req.brand.thumbnail);
      }
    }

    req.activeFiles = activeFiles;
    req.inactiveFiles = inactiveFiles;

    req.responce = {
      success: true,
      code: 200,
      message: "Brand updated successfully.",
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
      message: "Unable to update brand.",
      error,
    };
    next();
  }
};

exports.brandByUUID = async (req, res, next, uuid) => {
  try {
    const brand = await db.Brand.findOne({ where: { uuid } });
    if (brand === null) {
      failed(
        res,
        `Unable to find brand by UUID. ${uuid}`,
        (error = { name: "not_found" })
      );
    } else {
      req.brand = brand;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find brand by UUID. ${uuid}`, error);
  }
};
exports.translationByUUID = async (req, res, next, uuid) => {
  try {
    const translation = await db.BrandTranslation.findOne({
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

exports.brandBySlug = async (req, res, next, slug) => {
  try {
    const brand = await db.Brand.findOne({ where: { slug: slug } });
    if (brand === null) {
      failed(
        res,
        `Unable to find brand by slug. ${slug}`,
        (error = { name: "not_found" })
      );
    } else {
      req.brand = brand;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find brand by slug. ${slug}`, error);
  }
};

exports.read = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Brand retrieve successfully.",
    results: req.brand,
  });
};
exports.softRemove = async (req, res, next) => {
  const t = await db.sequelize.transaction();

  try {
    const brand = await db.Brand.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          id: req.brand.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );

    const { dataValues } = brand[1];
    const translations = await db.BrandTranslation.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          brandId: req.brand.id,
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
      message: "Brand softly deleted.",
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
      message: "Unable apply soft delete operation on brand.",
      error,
    };
    next();
  }
};
exports.reactivate = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  const { id } = req.brand;
  try {
    const brand = await db.Brand.update(
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

    const { dataValues } = brand[1];

    const translations = await db.BrandTranslation.update(
      { deletedAt: null },
      {
        where: {
          brandId: id,
        },
        returning: true,
      },
      { transaction: t }
    );
    await t.commit();
    req.responce = {
      success: true,
      code: 200,
      message: "Brand reactivate successfully.",
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
      message: "Unable to reactivate brand.",
      error,
    };
    next();
  }
};
exports.reactivateTranslation = async (req, res) => {
  const { id } = req.translation;
  try {
    const translation = await db.BrandTranslation.update(
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
    success(res, 200, "Brand Translation reactivate successfully.", {
      ...dataValues,
    });
    req.responce = {
      success: true,
      code: 200,
      message: "Brand Translation reactivate successfully.",
      results: {
        ...dataValues,
      },
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to reactivate Brand Translation.",
      error,
    };
    next();
  }
};
exports.hardRemove = async (req, res, next) => {
  try {
    await db.Brand.destroy({
      where: {
        id: req.brand.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: `Brand ${req.brand.slug} deleted parmanently.`,
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete brand.",
      error,
    };
    next();
  }
};
exports.hardRemoveTranslation = async (req, res, next) => {
  try {
    await db.BrandTranslation.destroy({
      where: {
        id: req.translation.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: "Brand Translation deleted parmanently.",
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete brand translation.",
      error,
    };
    next();
  }
};

exports.list = async (req, res, next) => {
  try {
    const brands = await db.Brand.findAll({
      attributes: { exclude: ["delatedAt"] },
      order: [["order", "ASC"]],
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: db.BrandTranslation,
          as: "translations",
          // where: { code: "en-US" }, //{code: "en-US"}, {isDefault: true}
          where: db.Sequelize.and({ code: "en-US" }, { deletedAt: null }),
        },
      ],
    });
    if (brands === null || brands.length <= 0) {
      req.responce = {
        success: false,
        message: "brands  not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All brands retrieve successfully.",
        results: brands,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "brands not found.",
      error,
    };
    next();
  }
};
exports.listWithAllTranslation = async (req, res, next) => {
  try {
    const brands = await db.Brand.findAll({
      include: [{ model: db.BrandTranslation, as: "translations" }],
    });
    if (brands === null || brands.length <= 0) {
      req.responce = {
        success: false,
        message: "brands not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All brands retrieve successfully.",
        results: brands,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "brands not found.",
      error,
    };
    next();
  }
};
