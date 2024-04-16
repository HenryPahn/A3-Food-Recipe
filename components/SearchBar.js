import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    // <form onSubmit={handleSearch}>
    //   <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."/>
    //   <button type="submit">Search</button>
    // </form>
    <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find recipe"
        style={{
          width: '450px',
          padding: '10px 20px',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          outline: 'none',
          marginRight: '-40px', // to overlay the search icon on the input
        }}
      />
      <button
        type="submit"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <FontAwesomeIcon icon={faSearch} color="#A0A0A0" />
      </button>
    </form>
  );
};