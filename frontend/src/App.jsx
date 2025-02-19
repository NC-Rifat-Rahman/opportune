import { useState, useEffect } from "react";
import React from "react";
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import CreateProductPage from "./components/products/ProductCreationForm";
import MyProductList from "./components/products/MyProductListForm";
import EditProduct from "./components/products/ProductEditForm";
import AllProductList from "./components/products/AllProductForm";
import ProductDetails from "./components/products/ProductDetails";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const renderComponent = () => {
    switch (currentPath) {
      case '/':
      case '/login':
        return <LoginForm />;
      case '/register':
        return <RegistrationForm />;
      case '/products/create':
        return <CreateProductPage />;
      case '/products/mylist':
        return <MyProductList />;
      case '/products':
        return <AllProductList />;
      default:
        if (currentPath.startsWith('/products/update/')) {
          const id = currentPath.split('/').pop();
          return <EditProduct id={id} />;
        }
        if (currentPath.startsWith('/products/details/')) {
          const id = currentPath.split('/').pop();
          return <ProductDetails id={id} />;
        }
        return <LoginForm />;
    }
  };

  return (
    <ApolloProvider client={client}>
      {renderComponent()}
    </ApolloProvider>
  );
}

export default App;