const mongoose = require("mongoose");
const HttpError = require("../utils/HttpError");

module.exports = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new HttpError(400, "Invalid product ID"));
  }
  next();
};
