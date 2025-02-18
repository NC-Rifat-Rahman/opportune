import { useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import CreateProductPage from "./components/products/ProductCreationForm";
import ProductList from "./components/products/ProductListForm";
import EditProduct from "./components/products/ProductEditForm";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/products/list" element={<ProductList />} />
        <Route path="/products/update/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;