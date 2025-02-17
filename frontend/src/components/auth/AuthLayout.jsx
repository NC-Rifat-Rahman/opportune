import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;