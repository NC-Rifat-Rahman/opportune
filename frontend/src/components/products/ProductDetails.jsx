import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PUBLIC_PRODUCT_BY_ID = gql`
  query GetPublicProductById($id: String!) {
    getPublicProductById(id: $id) {
      id
      name
      description
      price
      rentPrice
      userId
      available
      user {
        id
        email
      }
      categories
      count
      createdAt
      updatedAt
    }
  }
`;

const BUY_PRODUCT = gql`
  mutation BuyProduct($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      totalAmount
      createdAt
      product {
        name
        price
      }
      seller {
        email
      }
    }
  }
`;

const RENT_PRODUCT = gql`
  mutation RentProduct($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      totalAmount
      rentalStartDate
      rentalEndDate
      product {
        name
        rentPrice
      }
    }
  }
`;

const ProductDetails = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const { loading, error, data } = useQuery(GET_PUBLIC_PRODUCT_BY_ID, {
    variables: { id },
    context: {
      headers: {
        "email": email || "",
        "password": password || "",
      },
    },
  });

  const [buyProduct] = useMutation(BUY_PRODUCT);
  const [rentProduct] = useMutation(RENT_PRODUCT);

  const handleTransaction = (type) => {
    const product = data?.getPublicProductById;
    if (product.user.email === email) {
      setNotification({
        type: 'error',
        message: 'You cannot purchase or rent your own product.'
      });
      return;
    }
    setIsRenting(type === 'rent');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      if (isRenting) {
        const totalAmount = data.getPublicProductById.rentPrice * quantity;
        const rentalStartDate = new Date().toISOString().split('T')[0];
        const rentalEndDate = new Date();
        rentalEndDate.setDate(rentalEndDate.getDate() + 7);
        const rentalEndDateString = rentalEndDate.toISOString().split('T')[0];

        await rentProduct({
          variables: {
            input: {
              type: 'RENT',
              productId: data.getPublicProductById.id,
              rentalStartDate,
              rentalEndDate: rentalEndDateString,
              count: quantity,
            },
          },
        });
        setNotification({
          type: 'success',
          message: `Successfully rented ${quantity} item(s) for 7 days.`
        });
      } else {
        const totalAmount = data.getPublicProductById.price * quantity;

        await buyProduct({
          variables: {
            input: {
              type: 'PURCHASE',
              productId: data.getPublicProductById.id,
              count: quantity,
            },
          },
        });
        setNotification({
          type: 'success',
          message: `Successfully purchased ${quantity} item(s).`
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Transaction failed:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Transaction failed. Please try again.'
      });
    }
  };

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && setShowModal(false);
    if (showModal) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const product = data?.getPublicProductById;

  const formattedPrice = useMemo(
    () => product?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [product?.price]
  );

  const formattedRentPrice = useMemo(
    () => product?.rentPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [product?.rentPrice]
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
      {/* Notification Toast */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
            notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}
          role="alert"
        >
          <p className={`font-bold ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {notification.type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {notification.message}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>

        <div className="border-t pt-4 space-y-2">
          <p className="text-lg font-medium">Price: ${formattedPrice}</p>
          {product.rentPrice && (
            <p className="text-lg font-medium">
              Rent Price: ${formattedRentPrice}/day
            </p>
          )}
          <p className="text-sm text-gray-500">Categories: {product.categories.join(', ')}</p>
          <p className="text-sm text-gray-500">Seller: {product.user.email}</p>
          <p className="text-sm text-gray-500">Available: {product.available ? 'Yes' : 'No'}</p>
          <p className="text-sm text-gray-500">Created At: {new Date(product.createdAt).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Updated At: {new Date(product.updatedAt).toLocaleString()}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-16 border rounded-md p-2"
          />
          <button
            onClick={() => handleTransaction('buy')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
            disabled={!product.available}
          >
            Buy Now
          </button>
          {product.rentPrice && (
            <button
              onClick={() => handleTransaction('rent')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition"
              disabled={!product.available}
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
                    ? `Do you want to rent ${quantity} item(s) for $${(formattedRentPrice * quantity).toFixed(2)} per day?`
                    : `Do you want to buy ${quantity} item(s) for $${(formattedPrice * quantity).toFixed(2)}?`}
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