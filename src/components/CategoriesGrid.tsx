import React, { useState } from "react";

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Photography",
];

const CategoriesGrid: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-16 px-6">
      <h3 className="text-3xl font-bold text-center mb-8">
        Popular Categories
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setSelected(category)}
            className={`p-4 rounded-lg cursor-pointer transition ${
              selected === category ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {category}
          </div>
        ))}
      </div>
      {selected && <p className="text-center mt-6">You selected: {selected}</p>}
    </section>
  );
};

export default CategoriesGrid;
