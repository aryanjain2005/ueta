import mongoose from "mongoose";
const { Schema } = mongoose;

const brand_prodSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand", // Correct placement of ref
    required: true, // Optional: Make it required if necessary
  },
  prod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Correct placement of ref
    required: true, // Optional: Make it required if necessary
  },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
  },
  img: { type: String, required: true },
  role: {
    type: String,
    enum: ["dealer", "distributor", "user"],
    required: true,
  },
  type: {
    type: String,
    default: "standard",
    enum: ["admin", "standard"],
    required: true,
  },
  brand_prod: { type: [brand_prodSchema] },
});
const User = mongoose.model("User", userSchema);
export default User;
