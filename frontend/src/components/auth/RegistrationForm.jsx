import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [formData, setFormData] = useState({});
  
  const [registerUser, { loading }] = useMutation(REGISTER_MUTATION, {
    update: (cache, { data }) => {
      cache.writeQuery({
        query: gql`
          query GetUser {
            user {
              id
              email
              firstName
              lastName
            }
          }
        `,
        data: {
          user: data.register.user
        },
      });
    },
  });

  const onStepSubmit = (data) => {
    if (step < 3) {
      setFormData({ ...formData, ...data });
      setStep(step + 1);
    } else {
      const finalData = { ...formData, ...data };
      registerUser({ 
        variables: { 
          input: finalData 
        } 
      });
    }
  };

  const goBack = () => {
    setStep(step - 1);
  };

  return (
    <AuthLayout title="SIGN UP">
      <form onSubmit={handleSubmit(onStepSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <input
                {...register('firstName', { required: true })}
                className="p-2 border rounded"
                placeholder="First Name"
              />
              <input
                {...register('lastName', { required: true })}
                className="p-2 border rounded"
                placeholder="Last Name"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              {...register('address', { required: true })}
              className="w-full p-2 border rounded"
              placeholder="Address"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                {...register('email', { required: true })}
                type="email"
                className="p-2 border rounded"
                placeholder="Email"
              />
              <input
                {...register('phoneNumber', { required: true })}
                className="p-2 border rounded"
                placeholder="Phone Number"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
            />
            <input
              {...register('confirmPassword', {
                required: true,
                validate: (val) => val === watch('password')
              })}
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Confirm Password"
            />
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {step === 3 ? (loading ? 'Registering...' : 'REGISTER') : 'Next'}
          </button>
        </div>

        <div className="text-center">
          <span className="text-sm">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegistrationForm;