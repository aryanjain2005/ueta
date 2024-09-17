import mongoose from 'mongoose'
const { Schema } = mongoose

const distributorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})
const Distributor = mongoose.model('Distributor', distributorSchema)
