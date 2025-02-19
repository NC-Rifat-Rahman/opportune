import { useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import CreateProductPage from "./components/products/ProductCreationForm";
import MyProductList from "./components/products/MyProductListForm";
import EditProduct from "./components/products/ProductEditForm";
import AllProductList from "./components/products/AllProductForm";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/mylist" element={<MyProductList />} />
        <Route path="/products/update/:id" element={<EditProduct />} />
        <Route path="/products" element={< AllProductList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;