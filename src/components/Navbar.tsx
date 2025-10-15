import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">GigConnect</h1>
      <div className="space-x-4">
        <button className="hover:underline">Home</button>
        <button className="hover:underline">Services</button>
        <button className="hover:underline">About</button>
        <button className="hover:underline">Contact</button>
      </div>
    </nav>
  );
};

export default Navbar;
