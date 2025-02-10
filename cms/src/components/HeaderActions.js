import { useLocation } from "react-router-dom";
import { FaPlus, FaFilter } from "react-icons/fa";
import SearchBar from "../components/SearchBar";

const HeaderActions = ({ onNew, onFilter,onSearch, showSearch = true, showFilter = true, showAdd = true }) => {
  const location = useLocation();
  const pageTitle = location.pathname.replace("/", "").toUpperCase();

  return (
    <div className="header-actions">
      <h2>{pageTitle}</h2>
      <div className="header-actions-buttons">
        {showSearch && <SearchBar onSearch={onSearch}/>}
        {showFilter && (
          <button className="btn btn-primary" onClick={onFilter}>
            <FaFilter /> Filtro
          </button>
        )}
        {showAdd && (
          <button className="btn btn-primary" onClick={onNew}>
            <FaPlus /> Novo
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderActions;
