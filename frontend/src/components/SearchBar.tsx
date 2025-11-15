import React, { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchParams: any = {};
      if (name) searchParams.name = name;
      if (category) searchParams.category = category;
      if (minPrice) searchParams.minPrice = parseFloat(minPrice);
      if (maxPrice) searchParams.maxPrice = parseFloat(maxPrice);

      onSearch(searchParams);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [name, category, minPrice, maxPrice, onSearch]);

  return (
    <div className="search-bar">
      <h2>Search Sweets</h2>
      <div className="search-fields">
        <div className="search-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        <div className="search-field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Search by category"
          />
        </div>

        <div className="search-field">
          <label htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            type="number"
            step="0.01"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
          />
        </div>

        <div className="search-field">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            step="0.01"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
