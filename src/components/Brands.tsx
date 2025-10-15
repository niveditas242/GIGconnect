import React from "react";

const Brands: React.FC = () => {
  const logos = ["Adobe", "Facebook", "IBM", "Google", "Microsoft"];
  return (
    <section className="py-12 text-center">
      <p className="mb-6 text-gray-400">As used by</p>
      <div className="flex flex-wrap justify-center gap-8">
        {logos.map((logo) => (
          <div
            key={logo}
            className="text-gray-500 font-bold hover:text-white transition"
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
