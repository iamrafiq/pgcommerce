const { handleError } = require("./errorHandler");

exports.success = (
  res,
  {code, ...results}=responce
) => {
  res.status(code).json({
    ...results
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
    this.success(res, responce);
  }else{
    const { message, error } = responce;
    this.failed(res, message, error);
  }
};
