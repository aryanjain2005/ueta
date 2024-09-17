import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true }
})
const Product = mongoose.model('Product', productSchema)
