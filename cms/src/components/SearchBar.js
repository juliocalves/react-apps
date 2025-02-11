import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        onSearch(query);
      }
    }, 300); // Tempo de espera (300ms) antes de disparar a busca

    return () => clearTimeout(delayDebounce); // Limpa o timeout anterior
  }, [query, onSearch]);
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
