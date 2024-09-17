import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interface for the Brand document
export interface IBrand extends Document {
  name: string;
  img: string;
}

// Define Mongoose schema for the Brand model
const brandSchema: Schema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
});

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
