import mongoose from 'mongoose'
const { Schema } = mongoose

const dealerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  // no need cause will be fetched from products
  // brands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }]
})
const Dealer = mongoose.model('Dealer', dealerSchema)
