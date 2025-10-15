import React from "react";

const GlobalNetwork: React.FC = () => {
  return (
    <section className="py-16 text-center text-white bg-gray-900 relative">
      <h2 className="text-3xl font-bold mb-4">
        Tap into a global talent network
      </h2>
      <p className="mb-6 max-w-xl mx-auto">
        Connect with millions of freelancers worldwide for any project.
      </p>
      <img
        src="https://via.placeholder.com/800x300"
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
    </section>
  );
};

export default GlobalNetwork;
