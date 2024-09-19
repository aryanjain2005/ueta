import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interface for the Brand document
export interface IBrand extends Document {
  name: string;
  img: string;
  products: { _id: mongoose.Types.ObjectId }[]; // Define products with _id field
}

// Define Mongoose schema for the product reference
const productReferenceSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

// Define Mongoose schema for the Brand model
const brandSchema: Schema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  products: [productReferenceSchema], // Use the product reference schema
});

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
