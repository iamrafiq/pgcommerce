exports.handleDbError = (error) => {
  //,
  const { name, errors } = error;
  if (name) {
    if (name === "SequelizeValidationError" || name === "SequelizeUniqueConstraintError") {
      let customs = errors.map((item, index) => item.message);
      return {
        code: 400,
        errs: {
          customs,
          original: error,
        },
      };
    } else if (name === "SequelizeDatabaseError") {
      return {
        code: 400,
        errs: {
          customs: [
            "Sequelize Database Error",
            "Please inform database administrator",
          ],
          original: error,
        },
      };
    } else if (name === "SequelizeForeignKeyConstraintError") {
      return {
        code: 400,
        errs: {
          customs: [
            "Sequelize ForeignKey Constraint Error",
            "Please inform database administrator",
          ],
          original: error,
        },
      };
    } else {
      return false;
    }
  }
};
