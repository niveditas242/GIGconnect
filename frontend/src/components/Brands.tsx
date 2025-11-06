import React from "react";

const Brands = () => {
  return (
    <section className="bg-gray-50 py-12 text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">
        Trusted by Top Companies
      </h2>
      <div className="flex flex-wrap justify-center gap-12 opacity-70">
        <span className="text-2xl font-bold">Google</span>
        <span className="text-2xl font-bold">Amazon</span>
        <span className="text-2xl font-bold">Meta</span>
        <span className="text-2xl font-bold">Microsoft</span>
      </div>
    </section>
  );
};

export default Brands;
