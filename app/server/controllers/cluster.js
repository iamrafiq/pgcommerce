const db = require("../models/index");
const { success, failed } = require("./responce");

exports.create = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const cluster = await db.Cluster.create(
      {
        ...req.body,
      },
      { transaction: t }
    );
    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        const translation = await db.ClusterTranslation.create(
          {
            ...translations[i],
            clusterId: cluster.id,
          },
          { transaction: t }
        );
        translationsArray.push(translation);
      }
    }
    await t.commit();
    const { id, ...rest } = cluster.dataValues;
    const activeFiles = [];
    const { icon, thumbnail } = req.body;
    if (icon) {
      activeFiles.push({
        genre: "cluster",
        componentUUID: cluster.uuid,
        componentSlug: cluster.slug,
        componentField: "icon",
        url: icon,
      });
    }
    if (thumbnail) {
      activeFiles.push({
        genre: "cluster",
        componentUUID: cluster.uuid,
        componentSlug: cluster.slug,
        componentField: "thumbnail",
        url: thumbnail,
      });
    }
    req.activeFiles = activeFiles;
    req.responce = {
      success: true,
      code: 200,
      message: "Cluster created successfully.",
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
      message: "Unable to create cluster.",
      error,
    };
    next();
  }
};

exports.update = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const cluster = await db.Cluster.update(
      { ...req.body },
      {
        where: {
          id: req.cluster.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );
    const { dataValues } = cluster[1];

    const { translations } = req.body;
    let translationsArray = [];
    if (translations && translations.length > 0) {
      for (let i = 0; i < translations.length; i++) {
        if (translations[i].uuid) {
          const trans = await db.ClusterTranslation.findOne({
            where: { uuid: translations[i].uuid },
          });

          if (trans !== null) {
            // updating
            const translation = await db.ClusterTranslation.update(
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
            const translation = await db.ClusterTranslation.create(
              {
                ...translations[i],
                clusterId: req.cluster.id,
              },
              { transaction: t }
            );
            translationsArray.push(translation);
          }
        } else {
          // creating new row
          const translation = await db.ClusterTranslation.create(
            {
              ...translations[i],
              clusterId: req.cluster.id,
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
    if (!req.cluster.icon) {
      if (icon) {
        activeFiles.push({
          genre: "cluster",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "icon",
          url: icon,
        });
      }
    } else {
      if (icon && icon !== req.cluster.icon) {
        activeFiles.push({
          genre: "cluster",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "icon",
          url: icon,
        });
        inactiveFiles.push(req.cluster.icon);
      }
    }
    if (!req.cluster.thumbnail) {
      if (thumbnail) {
        activeFiles.push({
          genre: "cluster",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "thumbnail",
          url: thumbnail,
        });
      }
    } else {
      if (thumbnail && thumbnail !== req.cluster.thumbnail) {
        activeFiles.push({
          genre: "cluster",
          componentUUID: rest.uuid,
          componentSlug: rest.slug,
          componentField: "thumbnail",
          url: thumbnail,
        });
        inactiveFiles.push(req.cluster.thumbnail);
      }
    }

    req.activeFiles = activeFiles;
    req.inactiveFiles = inactiveFiles;

    req.responce = {
      success: true,
      code: 200,
      message: "Cluster updated successfully.",
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
      message: "Unable to update cluster.",
      error,
    };
    next();
  }
};

exports.clusterByUUID = async (req, res, next, uuid) => {
  try {
    const cluster = await db.Cluster.findOne({ where: { uuid } });
    if (cluster === null) {
      failed(
        res,
        `Unable to find cluster by UUID. ${uuid}`,
        (error = { name: "not_found" })
      );
    } else {
      req.cluster = cluster;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find cluster by UUID. ${uuid}`, error);
  }
};
exports.translationByUUID = async (req, res, next, uuid) => {
  try {
    const translation = await db.ClusterTranslation.findOne({
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

exports.clusterBySlug = async (req, res, next, slug) => {
  try {
    const cluster = await db.Cluster.findOne({ where: { slug: slug } });
    if (cluster === null) {
      failed(
        res,
        `Unable to find cluster by slug. ${slug}`,
        (error = { name: "not_found" })
      );
    } else {
      req.cluster = cluster;
      next();
    }
  } catch (error) {
    failed(res, `Unable to find cluster by slug. ${slug}`, error);
  }
};

exports.read = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "cluster retrieve successfully.",
    results: req.cluster,
  });
};
exports.softRemove = async (req, res, next) => {
  const t = await db.sequelize.transaction();

  try {
    const cluster = await db.Cluster.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          id: req.cluster.id,
        },
        returning: true,
        plain: true,
      },
      { transaction: t }
    );

    const { dataValues } = cluster[1];
    const translations = await db.ClusterTranslation.update(
      { deletedAt: db.Sequelize.fn("now") },
      {
        where: {
          clusterId: req.cluster.id,
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
      message: "cluster softly deleted.",
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
      message: "Unable apply soft delete operation on cluster.",
      error,
    };
    next();
  }
};
exports.reactivate = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  const { id } = req.cluster;
  try {
    const cluster = await db.Cluster.update(
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

    const { dataValues } = cluster[1];

    const translations = await db.ClusterTranslation.update(
      { deletedAt: null },
      {
        where: {
          clusterId: id,
        },
        returning: true,
      },
      { transaction: t }
    );
    await t.commit();
    req.responce = {
      success: true,
      code: 200,
      message: "cluster reactivate successfully.",
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
      message: "Unable to reactivate cluster.",
      error,
    };
    next();
  }
};
exports.reactivateTranslation = async (req, res) => {
  const { id } = req.translation;
  try {
    const translation = await db.ClusterTranslation.update(
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
    success(res, 200, "cluster Translation reactivate successfully.", {
      ...dataValues,
    });
    req.responce = {
      success: true,
      code: 200,
      message: "cluster Translation reactivate successfully.",
      results: {
        ...dataValues,
      },
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to reactivate cluster Translation.",
      error,
    };
    next();
  }
};
exports.hardRemove = async (req, res, next) => {
  try {
    await db.Cluster.destroy({
      where: {
        id: req.cluster.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: `cluster ${req.cluster.slug} deleted parmanently.`,
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete cluster.",
      error,
    };
    next();
  }
};
exports.hardRemoveTranslation = async (req, res, next) => {
  try {
    await db.ClusterTranslation.destroy({
      where: {
        id: req.translation.id,
      },
    });
    req.responce = {
      success: true,
      code: 200,
      message: "cluster translation deleted parmanently.",
      results: {},
    };
    next();
  } catch (error) {
    req.responce = {
      success: false,
      message: "Unable to delete cluster translation.",
      error,
    };
    next();
  }
};

exports.list = async (req, res, next) => {
  try {
    const clusters = await db.Cluster.findAll({
      attributes: { exclude: ["delatedAt"] },
      order: [["order", "ASC"]],
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: db.ClusterTranslation,
          as: "translations",
          // where: { code: "en-US" }, //{code: "en-US"}, {isDefault: true}
          where: db.Sequelize.and({ code: "en-US" }, { deletedAt: null }),
        },
      ],
    });
    if (clusters === null || clusters.length <= 0) {
      req.responce = {
        success: false,
        message: "clusters not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All clusters retrieve successfully.",
        results: clusters,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "clusters not found.",
      error,
    };
    next();
  }
};
exports.listWithAllTranslation = async (req, res, next) => {
  try {
    const clusters = await db.Cluster.findAll({
      include: [{ model: db.ClusterTranslation, as: "translations" }],
    });
    if (clusters === null || clusters.length <= 0) {
      req.responce = {
        success: false,
        message: "clusters not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All clusters retrieve successfully.",
        results: clusters,
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "clusters not found.",
      error,
    };
    next();
  }
};
