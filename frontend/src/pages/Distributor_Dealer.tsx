import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// Interfaces for User, Brand, and Product
interface User {
  _id: string
  name: string
  email: string
  img: string
  role: string
  type: string
}

interface Brand {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
}

interface BrandProductDetail {
  brand: Brand
  product: Product
}

interface GroupedBrandProducts {
  brand: Brand
  products: Product[]
}

const DistributorDealer: React.FC = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const objectId = query.get('objectId')

  // State to hold user data and brand-product details
  const [user, setUser] = useState<User | null>(null)
  const [groupedBrandProducts, setGroupedBrandProducts] = useState<
    GroupedBrandProducts[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/auth/getUserbyId/${objectId}`)
        if (response.status === 200) {
          setUser(response.data.user)

          // Group products by brand
          const brandProductMap: { [brandId: string]: GroupedBrandProducts } =
            {}

          response.data.brandProductDetails.forEach(
            ({ brand, product }: BrandProductDetail) => {
              if (!brandProductMap[brand._id]) {
                brandProductMap[brand._id] = {
                  brand,
                  products: []
                }
              }
              brandProductMap[brand._id].products.push(product)
            }
          )

          setGroupedBrandProducts(Object.values(brandProductMap))
        } else {
          setError('Failed to load user data')
        }
      } catch (err) {
        setError('Error fetching user data')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (objectId) {
      fetchData()
    } else {
      setError('No objectId provided')
      setLoading(false)
    }
  }, [objectId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="flex flex-row p-4">
      {user ? (
        <>
          {/* Left Side: User Details */}
          <div className="w-1/4">
            <img
              src={user.img}
              alt={user.name}
              className="w-40 h-auto border-black border-4"
            />
            <div>
              <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <p>Type: {user.type}</p>
            </div>
          </div>

          {/* Right Side: Grouped Brands and Products */}
          <div className="w-3/4 ml-10">
            {groupedBrandProducts.map(({ brand, products }) => (
              <div key={brand._id} className="border p-4 mb-4">
                <h2 className="text-xl font-bold">{brand.name}</h2>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Products:</h3>
                  <ul className="list-disc ml-5">
                    {products.map((product) => (
                      <li key={product._id}>
                        <p>{product.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  )
}

export default DistributorDealer
