import React from "react";
import "../styles/stylleadmin.scss";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-main">
      {children}
    </div>
  );
};

export default AdminLayout;