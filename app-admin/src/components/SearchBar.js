import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Loading from './Loading';

/**
 * SearchBar component that provides a search input with debounced search functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onSearch - The function to call when a search is performed.
 *
 * @example
 * <SearchBar onSearch={handleSearch} />
 *
 * @returns {JSX.Element} The rendered SearchBar component.
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
        setLoading(true); // Exibir loading antes da busca
        try {
          await onSearch(query); // Espera a busca finalizar
        } finally {
          setLoading(false); // Oculta loading após a busca
        }
      
    }, 300); // Tempo de espera (300ms) antes de disparar a busca

    return () => clearTimeout(delayDebounce); // Limpa o timeout anterior
  }, [query, onSearch]);

  // Função que é chamada ao submeter o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return; // Evita buscas vazias
    setLoading(true); // Exibir loading antes da busca
    try {
      await onSearch(query); // Espera a busca finalizar
    } finally {
      setLoading(false); // Oculta loading após a busca
    }
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
        <button className="btn btn-outline-primary" type="submit" disabled={loading}>
          <CiSearch />
        </button>
        {/* Exibe o Loading somente enquanto estiver processando */}
        {loading && <Loading />}
      </form>
      
  );
};

export default SearchBar;
