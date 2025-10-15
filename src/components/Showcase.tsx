import React from "react";

const Showcase: React.FC = () => {
  return (
    <section className="py-16 text-white">
      <div className="container mx-auto flex flex-wrap gap-6">
        <div className="flex-1">
          <img
            src="https://via.placeholder.com/500x500"
            alt="Large"
            className="rounded-lg"
          />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Tile 1"
            className="rounded-lg"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Tile 2"
            className="rounded-lg"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Tile 3"
            className="rounded-lg"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Tile 4"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Showcase;
