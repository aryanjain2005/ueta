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

interface Brand {
  _id: string
  name: string
  img: string
  products: Product[]
}

const BrandProduct: React.FC = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const objectId = query.get('objectId')
  const navigate = useNavigate()

  // State to hold brand/product data, users, products, and related brands
  const [data, setData] = useState<Brand | Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [distributors, setDistributors] = useState<User[]>([])
  const [dealers, setDealers] = useState<User[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [relatedBrands, setRelatedBrands] = useState<Brand[]>([])
  const [dataType, setDataType] = useState<string>('') // "brand" or "product"
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [popupData, setPopupData] = useState<User[]>([])
  const [popupTitle, setPopupTitle] = useState<string>('')

  // Fetch the data based on the objectId
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch the brand first
        let response = await axios.get<Brand>(`/api/brand/${objectId}`)

        if (response.status === 200) {
          setData(response.data)
          setDataType('brand')

          // Fetch related products for the brand
          const productIds = response.data.products.map(
            (product) => product._id
          )
          const productResponse = await axios.get<Product[]>(
            '/api/product/multiple',
            {
              params: { ids: productIds.join(',') }
            }
          )
          setRelatedProducts(productResponse.data)
        }
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          // If brand is not found, try fetching the product
          try {
            const productResponse = await axios.get<Product>(
              `/api/product/${objectId}`
            )
            if (productResponse.status === 200) {
              setData(productResponse.data)
              setDataType('product')

              // Fetch related brands for the product
              const brandResponse = await axios.get<Brand[]>(
                `/api/brand/byProduct/${objectId}`
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
    }

    // Fetch distributors and dealers based on objectId and dataType
    const fetchUsers = async () => {
      try {
        if (objectId && dataType) {
          const userResponse = await axios.get<User[]>(
            `/api/auth/byBrandProd`,
            {
              params: { dataType, objectId }
            }
          )
          const users = userResponse.data
          setDistributors(users.filter((user) => user.role === 'distributor'))
          setDealers(users.filter((user) => user.role === 'dealer'))
        }
      } catch (err) {
        setError('Failed to fetch distributors and dealers.')
      }
    }

    if (objectId) {
      fetchData()
      fetchUsers()
    } else {
      setError('No objectId provided')
      setLoading(false)
    }
  }, [objectId, dataType])

  // Type guard for AxiosError
  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined
  }

  // Handle popup visibility and fetch related users
  const handleItemClick = async (itemId: string, itemName: string) => {
    try {
      // Fetch users for the selected brand/product
      let params = {}
      if (dataType === 'brand') {
        // If dataType is 'brand', pass the brandId and clicked productId
        params = {
          brandId: objectId, // The brandId of the main brand
          productId: itemId, // The productId of the clicked product
          dataType: 'brandprod' // Set dataType to 'brandprod'
        }
      } else if (dataType === 'product') {
        // If dataType is 'product', pass the productId and clicked brandId
        params = {
          productId: objectId, // The productId of the main product
          brandId: itemId, // The brandId of the clicked brand
          dataType: 'brandprod' // Set dataType to 'brandprod'
        }
      }
      const response = await axios.get<User[]>('/api/auth/byBrandProd', {
        params
      })
      setPopupData(response.data)
      setPopupTitle(
        `${dataType === 'brand' ? 'Product: ' : 'Brand: '}${itemName}`
      )
      setPopupVisible(true)
    } catch (err) {
      console.error('Error fetching distributors and dealers:', err)
      setError('Failed to fetch popup data.')
    }
  }

  // Close the popup
  const closePopup = () => {
    setPopupVisible(false)
    setPopupData([])
    setPopupTitle('')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  const handleUserClick = (id: string) => {
    navigate(`/Distributor_Dealer?objectId=${id}`)
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
            {distributors.map((distributor) => (
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
            {dealers.map((dealer) => (
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
          {dataType === 'brand' ? (
            <>
              <h2 className="text-xl mt-4">Products</h2>
              <ul>
                {(data as Brand).products.map((product) => (
                  <li
                    key={product._id}
                    className="cursor-pointer"
                    onClick={() => handleItemClick(product._id, product.name)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-xl mt-4">Brands</h2>
              <ul>
                {(data as Product)._id &&
                  relatedBrands.map((brand) => (
                    <li
                      key={brand._id}
                      className="cursor-pointer"
                      onClick={() => handleItemClick(brand._id, brand.name)}
                    >
                      {brand.name}
                    </li>
                  ))}
              </ul>
            </>
          )}
          {popupVisible && (
            <div
              className="popup fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="popup-content bg-white p-6 rounded-lg"
                tabIndex={-1}
              >
                <h2 className="text-2xl font-bold mb-4">{popupTitle}</h2>
                <h3 className="text-xl">Distributors</h3>
                <ul>
                  {popupData
                    .filter((user) => user.role === 'distributor')
                    .map((user) => (
                      <li key={user._id}>{user.name}</li>
                    ))}
                </ul>
                <h3 className="text-xl mt-4">Dealers</h3>
                <ul>
                  {popupData
                    .filter((user) => user.role === 'dealer')
                    .map((user) => (
                      <li key={user._id}>{user.name}</li>
                    ))}
                </ul>
                <button
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>No data found for this objectId.</div>
      )}
    </div>
  )
}

export default BrandProduct
