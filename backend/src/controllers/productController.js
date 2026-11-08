const Product = require("../models/Product");
const HttpError = require("../utils/HttpError");

const FIELDS = ["name", "description", "price", "category", "imageUrl", "stock"];
const pick = (body) =>
  Object.fromEntries(FIELDS.filter((f) => body && body[f] !== undefined).map((f) => [f, body[f]]));

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.search) {
      filter.name = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    res.status(200).json(await Product.find(filter).sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, "Product not found");
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Product.create(pick(req.body)));
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = pick(req.body);
    if (!Object.keys(data).length) throw new HttpError(400, "No valid product fields provided");
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) throw new HttpError(404, "Product not found");
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new HttpError(404, "Product not found");
    res.status(200).json({ success: true, message: "Product deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
};
