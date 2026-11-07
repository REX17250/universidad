import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true},
    stock: { type: Number, required: true, min: 0, max: 500 },
    supplier: { type: String, required: true, trim: true }
});

export default mongoose.model("Product", productSchema);