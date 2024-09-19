import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'

// Define User interface
interface User {
  _id: string
  name: string
  role: string
}

interface Product {
  _id: string
  name: string
  img: string
}

const BrandProduct: React.FC = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const objectId = query.get('objectId')
  const navigate = useNavigate()

  // State to hold brand/product data, users, products, and related brands
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [distributors, setDistributors] = useState<User[]>([])
  const [dealers, setDealers] = useState<User[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [relatedBrands, setRelatedBrands] = useState<any[]>([])
  const [dataType, setDataType] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch the brand
        let response = await axios.get(
          `http://localhost:5000/brand/${objectId}`
        )

        if (response.status === 200) {
          setData(response.data)
          setDataType('brand')

          // Fetch related products
          const productIds = response.data.products.map(
            (product: any) => product._id
          )
          const productResponse = await axios.get(
            `http://localhost:5000/product/multiple`,
            {
              params: { ids: productIds.join(',') }
            }
          )
          setRelatedProducts(productResponse.data)
        }
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          // If brand not found, try fetching the product
          try {
            const productResponse = await axios.get(
              `http://localhost:5000/product/${objectId}`
            )
            if (productResponse.status === 200) {
              setData(productResponse.data)
              setDataType('product')

              // Fetch related brands
              const brandResponse = await axios.get(
                `http://localhost:5000/brand/byProduct/${objectId}`
              )
              setRelatedBrands(brandResponse.data)
            }
          } catch (productErr) {
            if (
              isAxiosError(productErr) &&
              productErr.response?.status === 404
            ) {
              setError('Data not found')
            } else {
              setError('An error occurred while fetching product data')
            }
            return
          }
        } else {
          setError('An error occurred while fetching brand data')
        }
      } finally {
        setLoading(false)
      }

      // Fetch users related to the objectId
      const userResponse = await axios.get(
        `http://localhost:5000/auth/byBrandProd/${objectId}?dataType=${dataType}`
      )
      const users = userResponse.data
      setDistributors(users.filter((user: User) => user.role === 'distributor'))
      setDealers(users.filter((user: User) => user.role === 'dealer'))
    }

    if (objectId) {
      fetchData()
    } else {
      setError('No objectId provided')
      setLoading(false)
    }
  }, [objectId, dataType])

  // Type guard for AxiosError
  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }
  const handleUserClick = (id: string) => {
    navigate(`/Distributor_Dealer?objectId=${id}`) // Navigate with query parameter
  }
  return (
    <div className="p-4">
      {data ? (
        <div>
          <div className="flex justify-evenly">
            <img
              src={data.img}
              alt={data.name}
              className="w-40 h-auto border-black border-4"
            />
            <h1 className="text-2xl font-bold px-20 py-10">{data.name}</h1>
          </div>
          <h2 className="text-xl mt-4">Distributors</h2>
          <ul>
            {distributors.map((distributor: User) => (
              <li
                key={distributor._id}
                className="cursor-pointer"
                onClick={() => handleUserClick(distributor._id)}
              >
                {distributor.name}
              </li>
            ))}
          </ul>
          <h2 className="text-xl mt-4">Dealers</h2>
          <ul>
            {dealers.map((dealer: User) => (
              <li
                key={dealer._id}
                className="cursor-pointer"
                onClick={() => handleUserClick(dealer._id)}
              >
                {dealer.name}
              </li>
            ))}
          </ul>

          {/* Display related products or brands */}
          {dataType === 'brand' && (
            <>
              <h2 className="text-xl mt-4">Related Products</h2>
              <ul>
                {relatedProducts.map((product: Product) => (
                  <li key={product._id}>{product.name}</li>
                ))}
              </ul>
            </>
          )}
          {dataType === 'product' && (
            <>
              <h2 className="text-xl mt-4">Related Brands</h2>
              <ul>
                {relatedBrands.map((brand) => (
                  <li key={brand._id}>{brand.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div>No data found for this objectId.</div>
      )}
    </div>
  )
}

export default BrandProduct
