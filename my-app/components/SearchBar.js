import { useState } from 'react';

export default function SearchBar ({onSearch}) {
  const [query, setQuery] = useState('');
  const handleSearch = (event) => {
    event.preventDefault(); 
    onSearch(query); 
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
};