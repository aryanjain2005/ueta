import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import axios from 'axios'

// Define TypeScript interfaces for the product data
interface ProductData {
  _id: string // Product ID
  name: string
  img: string
  brandId: string // Assuming you have brandId to redirect correctly
}

const Product: React.FC = () => {
  // State to hold product data and form input
  const [products, setProducts] = useState<ProductData[]>([])
  const [newProductName, setNewProductName] = useState<string>('')
  const [newProductImg, setNewProductImg] = useState<string>('')
  const navigate = useNavigate() // Initialize useNavigate

  // Fetch product data from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductData[]>(
          '/api/product/getProducts'
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
        '/api/product/addProduct',
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
        '/api/product/getProducts'
      )
      setProducts(response.data)
      // Clear the form inputs
      setNewProductName('')
      setNewProductImg('')
    } catch (error) {
      console.error('Error adding new product:', error)
    }
  }

  // Handle product image click
  const handleProductClick = (id: string) => {
    navigate(`/Brand_Product?objectId=${id}`) // Navigate with query parameter
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-wrap mb-4 justify-evenly">
        {products.map((product) => (
          <div key={product._id} className="md:w-1/2 lg:w-1/4 px-4 mb-4">
            <div className="bg-white p-6 border rounded-md shadow-md cursor-pointer flex flex-col items-center justify-center h-full">
              <img
                src={product.img}
                alt={product.name}
                className="w-28 h-28 rounded-md overflow-hidden object-contain"
                onClick={() => handleProductClick(product._id)} // Pass product ID
              />
              <h3 className="mt-2 text-center text-lg font-semibold">
                {product.name}
              </h3>
            </div>
          </div>
        ))}
        <div className="md:w-1/2 lg:w-1/4 px-4 mb-4">
          <div className="bg-white p-6 border rounded-md shadow-md cursor-pointer flex flex-col items-center justify-center h-full">
            <form onSubmit={handleAddProduct} className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
              <div className="mb-4">
                <input
                  id="name"
                  type="text"
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="mt-1 text-center block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  id="img"
                  type="text"
                  placeholder="Image URL"
                  value={newProductImg}
                  onChange={(e) => setNewProductImg(e.target.value)}
                  className="mt-1 text-center block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
