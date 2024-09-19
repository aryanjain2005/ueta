import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import axios from 'axios'

// Define TypeScript interfaces for the brand data
interface BrandData {
  _id: string // Include the _id field for navigation
  name: string
  img: string
}

const Brand: React.FC = () => {
  // State to hold brand data and form input
  const [brands, setBrands] = useState<BrandData[]>([])
  const [newBrandName, setNewBrandName] = useState<string>('')
  const [newBrandImg, setNewBrandImg] = useState<string>('')
  const navigate = useNavigate() // Initialize useNavigate

  // Fetch brand data from the backend API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get<BrandData[]>('/api/brand/getBrands')
        setBrands(response.data)
      } catch (error) {
        console.error('Error fetching brand data:', error)
      }
    }

    fetchBrands()
  }, [])

  // Handle form submission
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post(
        '/api/brand/addBrand',
        {
          name: newBrandName,
          img: newBrandImg
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      // Refresh brand list after adding new brand
      const response = await axios.get<BrandData[]>('/api/brand/getBrands')
      setBrands(response.data)
      // Clear the form inputs
      setNewBrandName('')
      setNewBrandImg('')
    } catch (error) {
      console.error('Error adding new brand:', error)
    }
  }

  // Handle brand image click
  const handleBrandClick = (id: string) => {
    navigate(`/Brand_Product?objectId=${id}`) // Navigate to the brand product page
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-wrap mb-4 justify-evenly">
        {brands.map((brand) => (
          <div key={brand._id} className="md:w-1/2 lg:w-1/4 px-4 mb-4">
            <div className="bg-white p-6 border rounded-md shadow-md cursor-pointer flex flex-col items-center justify-center h-full">
              <img
                src={brand.img}
                alt={brand.name}
                className="w-28 h-28 rounded-md overflow-hidden object-contain"
                onClick={() => handleBrandClick(brand._id)}
              />
              <h3 className="mt-2 text-center text-lg font-semibold">
                {brand.name}
              </h3>
            </div>
          </div>
        ))}
        <div className="md:w-1/2 lg:w-1/4 px-4 mb-4">
          <div className="bg-white p-6 border rounded-md shadow-md cursor-pointer flex flex-col items-center justify-center h-full">
            <form onSubmit={handleAddBrand} className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Add New</h2>
              <div className="mb-4">
                <input
                  id="name"
                  type="text"
                  placeholder="Brand Name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="mt-1 text-center block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  id="img"
                  type="text"
                  placeholder="Image URL"
                  value={newBrandImg}
                  onChange={(e) => setNewBrandImg(e.target.value)}
                  className="mt-1 text-center block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                Add Brand
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Brand
