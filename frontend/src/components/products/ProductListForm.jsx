import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

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

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String!
    $price: Float!
    $rentPrice: Float!
    $categories: [String!]!
    $available: Boolean!
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      rentPrice: $rentPrice
      categories: $categories
      available: $available
    ) {
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
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

// Sample categories - replace with your actual categories
const PRODUCT_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Sports',
  'Tools',
];

const ProductForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentPrice: '',
    categories: [],
    available: true
  });

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    update(cache, { data: { addProduct } }) {
      const existingProducts = cache.readQuery({ 
        query: GET_ALL_PRODUCTS 
      });
      
      cache.writeQuery({
        query: GET_ALL_PRODUCTS,
        data: { 
          myProducts: [...existingProducts.myProducts, addProduct]
        },
      });
    },
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache, { data: { deleteProduct } }) {
      const existingProducts = cache.readQuery({ 
        query: GET_ALL_PRODUCTS 
      });
      
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

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' 
      ? parseFloat(e.target.value) 
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAvailabilityChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      available: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          rentPrice: parseFloat(formData.rentPrice),
          categories: formData.categories,
          available: formData.available
        },
      });
      setFormData({
        name: '',
        description: '',
        price: '',
        rentPrice: '',
        categories: [],
        available: true
      });
      setCurrentStep(1);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct({
        variables: { id },
      });
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Products</h1>
        <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Product List */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {data.myProducts.map((product) => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pricing and Categories */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price ($)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Rent Price ($/day)
                </label>
                <Input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  placeholder="Enter rent price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label htmlFor={category} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.available}
                  onCheckedChange={handleAvailabilityChange}
                />
                <label htmlFor="available" className="text-sm font-medium">
                  Available for Rent/Sale
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={
                currentStep === 1 ? false :
                currentStep === 2 ? !formData.name || !formData.description : false
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit"
              disabled={
                !formData.name || 
                !formData.description || 
                !formData.price || 
                !formData.rentPrice || 
                formData.categories.length === 0
              }
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;