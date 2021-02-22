exports.formData = async (form, req) => {
  return await new Promise(async function (resolve, reject) {
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
      resolve({ fields, files: allFiles });
    }); //
  });
};
