import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Função que é chamada ao submeter o formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    // Chama a função de callback passada via props
    onSearch(query);
  };

  return (
    <form className="d-flex search-input" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Pesquisar..."
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-primary" type="submit">
        <CiSearch />
      </button>
    </form>
  );
};

export default SearchBar;
