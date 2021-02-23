const formidable = require("formidable");
const { cloudinary } = require("../utils/cloudinary.js");
const { initTempDir, unlinkStaticFile } = require("../utils/diskIO");
const { success, failed } = require("./responce");
const db = require("../models/index");

exports.files = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.uploadDir = initTempDir();
  const { fields, files } = await new Promise(async function (resolve, reject) {
    let allFiles = [];
    let fieldArray = [];
    form
      .on("file", function (field, file) {
        allFiles.push({ field: field, file: file });
      })
      .on("field", (fieldName, fieldValue) => {
        if (fieldName === "field_name") {
          fieldArray.push(fieldValue);
        }
        form.emit("fields", {
          name: "field",
          key: fieldName,
          value: fieldValue,
        });
      })
      .on("end", function () {});

    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields: { ...fields, fieldArray }, files: allFiles });
    }); //
  });

  try {
    let map = {};
    let uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
      let key = files[i].field;
      let uFile = await cloudinary.uploader.upload(files[i].file.path, {
        upload_preset: "ml_default",
      });
      if (key in map) {
        map[key].push(uFile.secure_url);
      } else {
        map[key] = [uFile.secure_url];
      }
      uploadedFiles.push(uFile.secure_url);
      unlinkStaticFile(files[i].file.path);
    }
    req.results = map;
    req.activeFiles = [];
    // all uploaded file should be inactive at first, untill they used in a create or update operation from a model.
    req.inactiveFiles = uploadedFiles;
    next();
  } catch (error) {
    failed(res, "Unable to upload files/photos", error);
  }
};

exports.storeFiles = async (req, res, next) => {
  const { activeFiles, inactiveFiles } = req;
    /********* Before changing code in here please read and understand bellow lines properly *************/
  // important first iterate throug inactive files then active files, sequence is need for array list of url such as products image
  // because while update if photos array has a new vlues then we are setting incomming vlues to active file and stored value to inactive files
  // so at first all url will get inactive value after then only those file which are in activeFiles array will be deactivated again
  try {
    if (inactiveFiles && inactiveFiles.length > 0) {
      inactiveFiles.map(async (url, index) => {
        const file = await db.File.findOne({
          where: { url },
        });
        if (!file) {
          await db.File.create({
            url,
            state: 0,
          });
        } else {
          await db.File.update(
            { state: 0 },
            {
              where: {
                uuid: file.uuid,
              },
            }
          );
        }
      });
    }

    if (activeFiles && activeFiles.length > 0) {
      activeFiles.map(async (item, index) => {
        const { url } = item;
        const file = await db.File.findOne({
          where: { url },
        });
        if (!file) {
          await db.File.create({
            ...item,
            state: 1,
          });
        } else {
          await db.File.update(
            { ...item, state: 1 },
            {
              where: {
                id: file.id,
              },
            }
          );
        }
      });
    }
    next();
  } catch (error) {
    next();
  }
};

exports.send = async (req, res, next) => {
  success(res, 200, "All files/photos uploaded successfully.", req.results);
};

//
exports.list = async (req, res, next) => {
  let {
    limit,
    offset,
    state,
    genre,
    componentUUID,
    componentSlug,
    componentField,
  } = req.query;
  let where = [];
  limit = limit ? parseInt(limit) : 100;
  offset = offset ? parseInt(offset) : 0;
  state = state ? parseInt(state) : 0;
  where.push({ state });
  componentUUID = componentUUID ? where.push({ componentUUID }) : "";
  componentSlug = componentSlug ? where.push({ componentSlug }) : "";
  componentField = componentField ? where.push({ componentField }) : "";
  let gens = [];
  if (genre) {
    genre.split(",").map((item) => gens.push({ genre: item }));
  }
  try {
    const files = await db.File.findAndCountAll({
      where:
        gens.length > 0
          ? db.Sequelize.and(...where, db.Sequelize.or(...gens))
          : db.Sequelize.and(...where),
      order: [["updatedAt", "DESC"]],
      limit: limit,
      offset: offset,
    });
    const {count, rows: results} = files;

    if (count == 0) {
      req.responce = {
        success: false,
        message: "Files not found.",
        error: { name: "not_found" },
      };
      next();
    } else {
      req.responce = {
        success: true,
        code: 200,
        message: "All files retrieve successfully.",
        count,
        results
      };
      next();
    }
  } catch (error) {
    req.responce = {
      success: false,
      message: "Files not found.",
      error,
    };
    next();
  }
};
