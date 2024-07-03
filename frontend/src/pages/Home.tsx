import React, { useState } from 'react';

const Home: React.FC = () => {
  const [searchBy, setSearchBy] = useState<string>('brand'); // Default search option

  const handleSearchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchBy(event.target.value);
  };

  const handleSearch = (query: string) => {
    // Implement search functionality based on selected option (searchBy)
    // This is where you would typically perform your search logic
    console.log(`Searching by ${searchBy}: ${query}`);
  };

  return (
    <div>
      <div>
        <select value={searchBy} onChange={handleSearchChange}>
          <option value="brand">By Brand</option>
          <option value="category">By Category</option>
          <option value="distributor">By Distributor</option>
          <option value="dealer">By Dealer</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {/* Render other content of your Home page */}
      <>Home Content</>
    </div>
  );
};

export default Home;
