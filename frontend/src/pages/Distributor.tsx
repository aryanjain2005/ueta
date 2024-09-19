import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Define TypeScript interfaces for the distributor data
interface DistributorData {
  _id: string // Distributor ID
  name: string
  img: string
  email: string
  role: string
  type: string
}

const Distributor: React.FC = () => {
  // State to hold distributor data
  const [distributors, setDistributors] = useState<DistributorData[]>([])
  const [error, setError] = useState<string | null>(null) // State for error handling
  const navigate = useNavigate() // Initialize useNavigate

  // Fetch distributor data from the backend API
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get<DistributorData[]>(
          '/api/auth/getDistributors'
        ) // Adjust the endpoint as needed
        setDistributors(response.data)
      } catch (error) {
        console.error('Error fetching distributor data:', error)
        setError('Failed to load distributors.') // Set error message
      }
    }

    fetchDistributors()
  }, [])

  // Handle distributor image click
  const handleDistributorClick = (id: string) => {
    navigate(`/Distributor_Dealer?objectId=${id}`) // Navigate with query parameter
  }

  return (
    <div className="flex flex-wrap -mx-4">
      {error && <p className="text-red-500 text-center">{error}</p>}{' '}
      {/* Display error message if any */}
      {distributors.map((distributor) => (
        <div
          key={distributor._id}
          className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4"
        >
          <div className="bg-white p-4 border rounded-md shadow-md cursor-pointer">
            <img
              src={distributor.img}
              alt={distributor.name}
              className="w-full h-auto rounded-md"
              onClick={() => handleDistributorClick(distributor._id)} // Attach click handler
            />
            <h3 className="mt-2 text-center text-lg font-semibold">
              {distributor.name}
            </h3>
            {distributor.email && (
              <p className="text-center text-sm text-gray-600">
                {distributor.email}
              </p>
            )}{' '}
            {/* Optional: Display email */}
            {distributor.role && (
              <p className="text-center text-sm text-gray-600">
                Role: {distributor.type}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Distributor
