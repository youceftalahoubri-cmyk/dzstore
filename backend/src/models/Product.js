const mongoose = require("mongoose");

const CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"], trim: true, maxlength: 200 },
    description: { type: String, required: [true, "description is required"], trim: true },
    price: { type: Number, required: [true, "price is required"], min: [0, "price must be >= 0"] },
    category: { type: String, required: [true, "category is required"], enum: { values: CATEGORIES, message: `category must be one of: ${CATEGORIES.join(", ")}` } },
    imageUrl: { type: String, required: [true, "imageUrl is required"], trim: true },
    stock: { type: Number, required: [true, "stock is required"], min: [0, "stock must be >= 0"], validate: { validator: Number.isInteger, message: "stock must be an integer" } },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const Product = mongoose.model("Product", productSchema);
Product.CATEGORIES = CATEGORIES;
module.exports = Product;
