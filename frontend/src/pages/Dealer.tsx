import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Define TypeScript interfaces for the dealer data
interface DealerData {
  _id: string // Dealer ID
  name: string
  img: string
  email: string
  role: string
  type: string
}

const Dealer: React.FC = () => {
  // State to hold dealer data
  const [dealers, setDealers] = useState<DealerData[]>([])
  const [error, setError] = useState<string | null>(null) // State for error handling
  const navigate = useNavigate() // Initialize useNavigate

  // Fetch dealer data from the backend API
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get<DealerData[]>('/api/auth/getDealers') // Adjust the endpoint as needed
        setDealers(response.data)
      } catch (error) {
        console.error('Error fetching dealer data:', error)
        setError('Failed to load dealers.') // Set error message
      }
    }

    fetchDealers()
  }, [])

  // Handle dealer image click
  const handleDealerClick = (id: string) => {
    navigate(`/Distributor_Dealer?objectId=${id}`) // Navigate with query parameter
  }

  return (
    <div className="flex flex-wrap -mx-4">
      {error && <p className="text-red-500 text-center">{error}</p>}{' '}
      {/* Display error message if any */}
      {dealers.map((dealer) => (
        <div key={dealer._id} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
          <div className="bg-white p-4 border rounded-md shadow-md cursor-pointer">
            <img
              src={dealer.img}
              alt={dealer.name}
              className="w-full h-auto rounded-md"
              onClick={() => handleDealerClick(dealer._id)} // Attach click handler
            />
            <h3 className="mt-2 text-center text-lg font-semibold">
              {dealer.name}
            </h3>
            {dealer.email && (
              <p className="text-center text-sm text-gray-600">
                {dealer.email}
              </p>
            )}{' '}
            {/* Optional: Display email */}
            {dealer.role && (
              <p className="text-center text-sm text-gray-600">
                Role: {dealer.type}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Dealer
