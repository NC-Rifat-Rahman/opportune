import ProductCreationForm from '../components/ProductCreationForm';

const CreateProductPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <ProductCreationForm />
    </div>
  );
};

export default CreateProductPage;