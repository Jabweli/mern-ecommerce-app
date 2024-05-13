import React from "react";
import "./Admin.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import AddProduct from "../../components/AddProduct/AddProduct";
import ListProduct from "../../components/ListProduct/ListProduct";
import { Route, Routes } from "react-router-dom";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />

      <div className="main-area">
        <Routes>
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/products" element={<ListProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
