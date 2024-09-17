import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  img: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  //   brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
});

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
