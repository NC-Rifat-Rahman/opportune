import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    getProductById(id: $id) {
      id
      name
      description
      price
      rentPrice
      categories
      user {
        id
        email
      }
    }
  }
`;

const ProductDetails = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRenting, setIsRenting] = useState(false);

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
    onError: (err) => console.error('Failed to fetch product:', err),
  });

  console.log(error);
  
  const handleTransaction = (type) => {
    setIsRenting(type === 'rent');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const transactionType = isRenting ? 'rental' : 'purchase';
      console.log(`Processing ${transactionType}`);
      setShowModal(false);
    } catch (error) {
      console.error(`Transaction failed:`, error);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && setShowModal(false);
    if (showModal) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const product = data?.getProductById;

  const formattedPrice = useMemo(
    () => product?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [product?.price]
  );

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="font-bold text-red-800">Error</p>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="font-bold text-red-800">Not Found</p>
          <p className="text-red-700">This product could not be found.</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>

        <div className="border-t pt-4 space-y-2">
          <p className="text-lg font-medium">Price: ${formattedPrice}</p>
          {product.rentPrice && (
            <p className="text-lg font-medium">
              Rent Price: ${product.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}/day
            </p>
          )}
          <p className="text-sm text-gray-500">Categories: {product.categories.join(', ')}</p>
          <p className="text-sm text-gray-500">Seller: {product.user.email}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleTransaction('buy')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
          >
            Buy Now
          </button>
          {product.rentPrice && (
            <button
              onClick={() => handleTransaction('rent')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition"
            >
              Rent Now
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-lg max-w-sm w-full mx-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h2 id="modal-title" className="text-lg font-semibold mb-4">
                  Confirm {isRenting ? 'Rental' : 'Purchase'}
                </h2>
                <p className="mb-6">
                  {isRenting
                    ? `Do you want to rent this item for $${product.rentPrice}/day?`
                    : `Do you want to buy this item for $${product.price}?`}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-white rounded-md transition ${
                      isRenting ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
