import React, { useState } from 'react';

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const graphqlQuery = {
      query: `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            id
            email
          }
        }
      `,
      variables: {
        input: {
          email,
          password
        }
      }
    };

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery)
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message || 'Registration failed');
      }

      if (data.data?.register) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-center text-2xl font-bold mb-6">SIGN UP</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200">
              Registration successful!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'REGISTER'}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm">Already have an account? </span>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="text-blue-600 hover:underline"
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;