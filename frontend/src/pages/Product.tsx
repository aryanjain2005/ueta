import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Define TypeScript interfaces for the product data
interface ProductData {
  name: string
  img: string
}

const Product: React.FC = () => {
  // State to hold product data and form input
  const [products, setProducts] = useState<ProductData[]>([])
  const [newProductName, setNewProductName] = useState<string>('')
  const [newProductImg, setNewProductImg] = useState<string>('')

  // Fetch product data from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductData[]>(
          'http://localhost:5000/product/getProducts'
        )
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching product data:', error)
      }
    }

    fetchProducts()
  }, [])

  // Handle form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post(
        'http://localhost:5000/product/addProduct',
        {
          name: newProductName,
          img: newProductImg
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      // Refresh product list after adding new product
      const response = await axios.get<ProductData[]>(
        'http://localhost:5000/product/getProducts'
      )
      setProducts(response.data)
      // Clear the form inputs
      setNewProductName('')
      setNewProductImg('')
    } catch (error) {
      console.error('Error adding new product:', error)
    }
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-wrap -mx-4 mb-4">
        {products.map((product, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
            <div className="bg-white p-4 border rounded-md shadow-md">
              <img
                src={product.img}
                alt={`Product ${index}`}
                className="w-full h-auto rounded-md"
              />
              <h3 className="mt-2 text-center text-lg font-semibold">
                {product.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddProduct} className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="img"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            id="img"
            type="text"
            value={newProductImg}
            onChange={(e) => setNewProductImg(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}

export default Product
