import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-black bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="text-white font-bold text-xl">Your Logo Here</div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-white hover:text-accent">
            Find Talent
          </a>
          <a href="#" className="text-white hover:text-accent">
            Find Work
          </a>
          <a href="#" className="text-white hover:text-accent">
            How It Works
          </a>
          <a
            href="#"
            className="px-4 py-2 border border-accent text-accent rounded hover:bg-accent hover:text-white transition"
          >
            Sign In
          </a>
          <a
            href="#"
            className="px-4 py-2 bg-accent text-white rounded hover:bg-pink-600 transition"
          >
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
