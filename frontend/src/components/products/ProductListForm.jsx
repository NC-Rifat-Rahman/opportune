import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    myProducts {
      id
      name
      description
      price
      rentPrice
      categories
      available
      user {
        id
        email
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(input: { id: $id }) {
      id
      name
    }
  }
`;

const ProductList = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache, { data: { deleteProduct } }) {
      const existingProducts = cache.readQuery({ 
        query: GET_ALL_PRODUCTS 
      }) || { myProducts: [] };

      cache.writeQuery({
        query: GET_ALL_PRODUCTS,
        data: {
          myProducts: existingProducts.myProducts.filter(
            (product) => product.id !== deleteProduct.id
          ),
        },
      });
    },
  });

  // Define the handleDeleteClick function
  const handleDeleteClick = (product) => {
    console.log("PRODUCTS",product);
    
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Define the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteProduct({
        variables: { id: productToDelete.id },
      });
      console.log("Delete response:", response);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.log('Error deleting product:', err);
    }
  };

  // Define the handleCancelDelete function
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button
          onClick={() => navigate('/products/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="space-y-4">
        {data.myProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="text-sm">
                  <p>Price: ${product.price}</p>
                  <p>Rent Price: ${product.rentPrice}/day</p>
                  <p>Categories: {product.categories.join(', ')}</p>
                  <p>Status: {product.available ? 'Available' : 'Unavailable'}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteClick(product)} // Ensure handleDeleteClick is properly referenced
                className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
