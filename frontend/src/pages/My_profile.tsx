import React, { useEffect, useState } from 'react'
import axios from 'axios'

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

const MyProfile: React.FC = () => {
  // State to hold user data, brands, products, and grouped brand-products
  const [user, setUser] = useState<User | null>(null)
  const [groupedBrandProducts, setGroupedBrandProducts] = useState<
    GroupedBrandProducts[]
  >([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [showDropdowns, setShowDropdowns] = useState<boolean>(false) // Single state to show both dropdowns

  useEffect(() => {
    const fetchData = async () => {
      const userJson = localStorage.getItem('user') // Get the user JSON string
      if (!userJson) {
        setError('Please login first')
        setLoading(false)
        window.location.href = '/login' // Redirect unauthenticated users
        return
      }

      try {
        const userData = JSON.parse(userJson) // Parse the JSON string
        const userId = userData.userId // Extract the userId from the parsed data

        const response = await axios.get(`/api/auth/getUserbyId/${userId}`)
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Fetch brands and products for dropdowns
    const fetchBrandsAndProducts = async () => {
      try {
        const brandsResponse = await axios.get('/api/brand/getBrands')
        setBrands(brandsResponse.data)

        const productsResponse = await axios.get('/api/product/getProducts')
        setProducts(productsResponse.data)
      } catch (err) {
        console.error('Error fetching brands/products:', err)
        setError('Failed to load brands or products')
      }
    }

    fetchBrandsAndProducts()
  }, [])

  const handleAddBrandAndProducts = async () => {
    const userJson = localStorage.getItem('user') // Get the user JSON string
    if (!userJson) {
      setError('Please login first')
      setLoading(false)
      window.location.href = '/login' // Redirect unauthenticated users
      return
    }

    const userData = JSON.parse(userJson) // Parse the JSON string
    const userId = userData.userId

    if (selectedBrandId && selectedProductIds.length > 0) {
      try {
        await axios.post('/api/user/addBrandAndProducts', {
          userId,
          brandId: selectedBrandId,
          productIds: selectedProductIds
        })
        alert('Brand and products added successfully')
        setShowDropdowns(false) // Hide dropdowns after submission
      } catch (error) {
        console.error('Error adding brand and products:', error)
        setError('Failed to add brand and products')
      }
    } else {
      setError('Please select both a brand and at least one product')
    }
  }

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setSelectedProductIds(selectedValues) // This should now work as selectedProductIds is an array of strings
  }

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
            <button
              onClick={() => setShowDropdowns(!showDropdowns)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Brand and Products
            </button>

            {showDropdowns && (
              <div className="mt-2">
                {/* Brand Dropdown */}
                <select
                  value={selectedBrandId || ''}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="p-2 border"
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                {/* Product Dropdown */}
                <select
                  multiple
                  value={selectedProductIds}
                  onChange={handleProductSelection}
                  className="p-2 border"
                >
                  <option value="">Select products</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddBrandAndProducts}
              className="ml-2 bg-green-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  )
}

export default MyProfile
