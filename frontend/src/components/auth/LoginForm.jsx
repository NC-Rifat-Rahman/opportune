import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { client } from '../../apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`;

const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login?.user) {
        client.writeQuery({
          query: gql`
            query GetUser {
              user {
                id
                email
              }
            }
          `,
          data: {
            user: data.login.user
          },
        });
        navigate('/dashboard');
      }
    },
    onError: (err) => {
      console.error("Login failed:", err);
      console.error("Error details:", err.graphQLErrors || err.networkError || err);
    }
  });

  const onSubmit = (data) => {
    login({ variables: data });
  };

  return (
    <AuthLayout title="SIGN IN">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('email', { required: "Email is required" })}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        
        <div>
          <input
            {...register('password', { required: "Password is required" })}
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Password"
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        {error && <div className="text-red-500 text-sm">{error.message}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {loading ? 'Loading...' : 'LOGIN'}
        </button>

        <div className="text-center">
          <span className="text-sm">Don't have an account? </span>
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
            Signup
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;
