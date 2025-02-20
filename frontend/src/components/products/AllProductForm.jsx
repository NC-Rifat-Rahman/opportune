import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_ALL_PRODUCTS = gql`
  query {
    getAllProducts {
      id
      name
      description
      price
      rentPrice
      categories
      userId
    }
  }
`;

const ProductList = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleProductClick = (product) => {
    if (currentUser?.id === product.userId) {
      alert("You cannot buy your own product!");
      return;
    }

    window.history.pushState({}, "", `/products/details/${product.id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  const products = data?.getAllProducts || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="space-y-2">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="text-sm">
                <p>Price: ${product.price}</p>
                {product.rentPrice && <p>Rent Price: ${product.rentPrice}/day</p>}
                <p>Categories: {product.categories.join(", ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
