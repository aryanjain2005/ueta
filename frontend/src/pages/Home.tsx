import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const [searchBy, setSearchBy] = useState<string>('brand')
  const [query, setQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<
    { name: string; objectId: string }[]
  >([])
  const [data, setData] = useState<Record<
    string,
    { name: string; objectId: string }[]
  > | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch data from backend APIs
    const fetchData = async () => {
      try {
        const [brandsRes, productsRes, dealersRes, distributorsRes] =
          await Promise.all([
            fetch('/api/brand/getBrands').then((res) => res.json()),
            fetch('/api/product/getProducts').then((res) => res.json()),
            fetch('/api/auth/getDealers').then((res) => res.json()),
            fetch('/api/auth/getDistributors').then((res) => res.json())
          ])

        setData({
          brand: brandsRes.map((b: any) => ({ name: b.name, objectId: b._id })),
          product: productsRes.map((p: any) => ({
            name: p.name,
            objectId: p._id
          })),
          dealer: dealersRes.map((d: any) => ({
            name: d.name,
            objectId: d._id
          })),
          distributor: distributorsRes.map((d: any) => ({
            name: d.name,
            objectId: d._id
          }))
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchBy(event.target.value)
    setQuery('')
    setSuggestions([])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase()
    setQuery(searchQuery)

    if (data && searchQuery) {
      // Filter and rank suggestions
      const filteredSuggestions = data[searchBy]
        ?.filter((item) => {
          const words = item.name.split(/\s+/) // Split by spaces or multiple spaces
          return words.some((word) =>
            word.toLowerCase().startsWith(searchQuery)
          )
        })
        ?.sort((a, b) => {
          const rank = (item: { name: string }) => {
            const words = item.name.split(/\s+/)
            let positionScore = 0
            let matchCount = 0

            words.forEach((word, index) => {
              if (word.toLowerCase().startsWith(searchQuery)) {
                matchCount++
                // Add position score (earlier positions get higher weight)
                positionScore += 100 - index * 10 // Example: 100 for first word, 90 for second, etc.
              }
            })

            // Bonus for exact match of any word
            const exactMatchBonus = words.some(
              (word) => word.toLowerCase() === searchQuery
            )
              ? 1000
              : 0

            return exactMatchBonus + positionScore + matchCount * 10
          }

          return rank(b) - rank(a) // Higher rank first
        })

      setSuggestions(filteredSuggestions || [])
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: {
    name: string
    objectId: string
  }) => {
    const baseRoute = ['brand', 'product'].includes(searchBy)
      ? '/Brand_Product'
      : '/Distributor_dealer'
    navigate(`${baseRoute}?objectId=${suggestion.objectId}`)
  }

  return (
    <div>
      <div>
        <select value={searchBy} onChange={handleSearchChange}>
          <option value="brand">By Brand</option>
          <option value="product">By Product</option>
          <option value="dealer">By Dealer</option>
          <option value="distributor">By Distributor</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={query}
          onChange={handleInputChange}
        />
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul style={{ border: '1px solid #ccc', marginTop: '5px' }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                  listStyle: 'none'
                }}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Render other content of your Home page */}
      <>Home Content</>
    </div>
  )
}

export default Home
