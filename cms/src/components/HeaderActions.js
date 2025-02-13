import { useLocation } from "react-router-dom";
import { FaPlus, FaFilter } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { CiViewTimeline,CiViewTable  } from "react-icons/ci";
const HeaderActions = ({ onNew, onFilter,onSearch,onChangeView, showSearch = false, 
    showFilter = false, showAdd = false,showChangeView=false,isTableView }) => {
  const location = useLocation();
  const pageTitle = location.pathname.replace("/", "").toUpperCase();
  
  return (
    <div className="header-actions">
      <h2>{pageTitle}</h2>
      <div className="search">
        {showSearch && <SearchBar onSearch={onSearch}/>}
      </div>
      <div className="header-actions-buttons">
      {showChangeView && (
          <button className="btn btn-primary" onClick={onChangeView}>
            {isTableView ? <CiViewTimeline /> : <CiViewTable />}{" "}
            {isTableView ? "Cards" : "Tabela"}
          </button>
        )}
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
