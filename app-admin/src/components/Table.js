const Table = ({ tableHead, tableBody }) => {
    return (
      <div className="cms-table-container">
        <div className="table-responsive-sm">
          <table className="table table-hover cms-table">
            <thead className="cms-table-header">
              <tr>{tableHead}</tr>
            </thead>
            <tbody className="cms-table-body">{tableBody}</tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Table;
  