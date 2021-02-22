const { handleError } = require("./errorHandler");

exports.success = (
  res,
  code = 200,
  message = "Executed successfully.",
  results = {}
) => {
  res.status(code).json({
    success: true,
    message,
    results,
  });
};

exports.failed = (res, message = "Execution failed.", error, statusCode = 400) => {
  const { code, errs } = handleError(error, message, statusCode);
  res.status(code).json({
    success: false,
    message,
    errors: errs,
  });
};

exports.responce = (req, res) => {
  const { responce } = req;
  if (responce.success) {
    const { code, message, results } = responce;
    this.success(res, code, message, results);
  }else{
    const { message, error } = responce;
    this.failed(res, message, error);
  }
};
