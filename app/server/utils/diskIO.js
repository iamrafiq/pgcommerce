const fs = require("fs");

exports.initTempDir = () => {
  let temDir = `./tempDir`;
  if (!fs.existsSync(temDir)) {
    fs.mkdirSync(temDir);
  }
  return temDir;
};

exports.unlinkStaticFile = (path) => {
  fs.unlinkSync(path, function (err) {
    console.log("error unlink", err);
  });
  fs.rea
}