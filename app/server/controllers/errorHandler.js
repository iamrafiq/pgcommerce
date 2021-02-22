const { handleDbError } = require("./dbErrorHandler");

exports.handleError = (error, message = "", statusCode) => {
  if (error instanceof TypeError) {
    return {
      code: 500,
      errs: {
        customs: ["Type Error"],
        original: { error: error.toString() },
      },
    };
  } else if (error instanceof ReferenceError) {
    return {
      code: 500,
      errs: {
        customs: ["Reference Error"],
        original: { error: error.toString() },
      },
    };
  } else if (error.name && error.name === "not_found") {
    return {
      code: 400,
      errs: {
        customs: [message],
        original: error,
      },
    };
  } else {
    let dbError = handleDbError(error);
    if (!dbError) {
      return {
        code: statusCode?statusCode:500,
        errs: {
          customs: ["Error!!!"],
          original: error,
        },
      };
    } else {
      return dbError;
    }
  }
};
