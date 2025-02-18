import { useLocation } from "react-router-dom";
import { FaPlus, FaFilter } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { CiViewTimeline,CiViewTable  } from "react-icons/ci";
/**
 * HeaderActions component renders a header with optional actions such as search, filter, add new item, and change view.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onNew - Callback function to handle the "new" action.
 * @param {Function} props.onFilter - Callback function to handle the "filter" action.
 * @param {Function} props.onSearch - Callback function to handle the "search" action.
 * @param {Function} props.onChangeView - Callback function to handle the "change view" action.
 * @param {boolean} [props.showSearch=false] - Flag to show or hide the search bar.
 * @param {boolean} [props.showFilter=false] - Flag to show or hide the filter button.
 * @param {boolean} [props.showAdd=false] - Flag to show or hide the add new button.
 * @param {boolean} [props.showChangeView=false] - Flag to show or hide the change view button.
 * @param {boolean} props.isTableView - Flag to indicate if the current view is table view.
 *
 * @returns {JSX.Element} The rendered HeaderActions component.
 */
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
