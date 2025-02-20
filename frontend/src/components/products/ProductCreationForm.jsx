import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

/**
 * GraphQL Mutation for creating a product
 */
const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      rentPrice
      categories
      createdAt
      updatedAt
      userId
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

/**
 * @typedef {Object} ProductFormData
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} rentPrice
 * @property {Array<string>} categories
 */

/** @type {Array<'ELECTRONICS' | 'FURNITURE' | 'HOME_APPLIANCES' | 'SPORTING_GOODS' | 'OUTDOOR' | 'TOYS'>} */
const CATEGORIES = ['ELECTRONICS', 'FURNITURE', 'HOME_APPLIANCES', 'SPORTING_GOODS', 'OUTDOOR', 'TOYS'];

/**
 * @param {{ formData: ProductFormData, updateFormData: Function }} props
 */
const BasicInfo = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium mb-2">Product Name</label>
      <input
        type="text"
        placeholder="e.g., iPhone 16 Pro"
        value={formData.name || ''}
        onChange={(e) => updateFormData('name', e.target.value)}
        className="w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Description</label>
      <textarea
        placeholder="Enter product description"
        value={formData.description || ''}
        onChange={(e) => updateFormData('description', e.target.value)}
        className="w-full p-2 border rounded-md min-h-[100px]"
      />
    </div>
  </div>
);

/**
 * @param {{ formData: ProductFormData, updateFormData: Function }} props
 */
const PriceAndCategories = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium mb-2">Price ($)</label>
      <input
        type="number"
        step="0.01"
        placeholder="e.g., 1200.99"
        value={formData.price || ''}
        onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
        className="w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Rent Price ($)</label>
      <input
        type="number"
        step="0.01"
        placeholder="e.g., 750.10"
        value={formData.rentPrice || ''}
        onChange={(e) => updateFormData('rentPrice', parseFloat(e.target.value))}
        className="w-full p-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Category</label>
      <select 
        value={formData.categories?.[0] || ''} 
        onChange={(e) => updateFormData('categories', [e.target.value])}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select a category</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  </div>
);

/**
 * @param {{ formData: ProductFormData }} props
 */
const Review = ({ formData }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Review Information</h3>
    <div className="space-y-4">
      <div>
        <p className="font-medium">Name</p>
        <p className="text-gray-600">{formData.name}</p>
      </div>
      <div>
        <p className="font-medium">Description</p>
        <p className="text-gray-600">{formData.description}</p>
      </div>
      <div>
        <p className="font-medium">Price</p>
        <p className="text-gray-600">${formData.price?.toFixed(2)}</p>
      </div>
      <div>
        <p className="font-medium">Rent Price</p>
        <p className="text-gray-600">${formData.rentPrice?.toFixed(2)}</p>
      </div>
      <div>
        <p className="font-medium">Categories</p>
        <p className="text-gray-600">{formData.categories?.join(', ')}</p>
      </div>
    </div>
  </div>
);

const ProductCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    rentPrice: 0,
    categories: []
  });

  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT_MUTATION);

  const steps = [
    { title: 'Basic Information', component: BasicInfo },
    { title: 'Price & Categories', component: PriceAndCategories },
    { title: 'Review', component: Review },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await createProduct({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            rentPrice: formData.rentPrice,
            categories: formData.categories
          }
        }
      });

      console.log('Product created successfully:', data);
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6">
        <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
        <div className="flex justify-between mt-6">
          <button onClick={handleBack} disabled={currentStep === 0} className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50">Back</button>
          {currentStep === steps.length - 1 ? (
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
          )}
        </div>
        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default ProductCreationForm;
