import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import CreateProductPage from './components/products/ProductCreationForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/products/create" element={<CreateProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;