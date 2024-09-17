import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Define TypeScript interfaces for the brand data
interface BrandData {
  name: string
  img: string
}

const Brand: React.FC = () => {
  // State to hold brand data and form input
  const [brands, setBrands] = useState<BrandData[]>([])
  const [newBrandName, setNewBrandName] = useState<string>('')
  const [newBrandImg, setNewBrandImg] = useState<string>('')

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

    // Fetch the hello endpoint if needed
    const fetchHello = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hello')
        console.log(response)
      } catch (error) {
        console.error('Error fetching hello:', error)
      }
    }

    fetchHello()
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

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-wrap -mx-4 mb-4">
        {brands.map((brand, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
            <div className="bg-white p-4 border rounded-md shadow-md">
              <img
                src={brand.img}
                alt={`Brand ${index}`}
                className="w-full h-auto rounded-md"
              />
              <h3 className="mt-2 text-center text-lg font-semibold">
                {brand.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddBrand} className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add a New Brand</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Name
          </label>
          <input
            id="name"
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
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
            value={newBrandImg}
            onChange={(e) => setNewBrandImg(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        >
          Add Brand
        </button>
      </form>
    </div>
  )
}

export default Brand
