import React from "react";

const Features: React.FC = () => {
  return (
    <section className="py-16 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Make it real with Freelancer
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-900 rounded-lg text-center">Feature 1</div>
        <div className="p-6 bg-gray-900 rounded-lg text-center">Feature 2</div>
        <div className="p-6 bg-gray-900 rounded-lg text-center">Feature 3</div>
        <div className="p-6 bg-gray-900 rounded-lg text-center">Feature 4</div>
      </div>
    </section>
  );
};

export default Features;
