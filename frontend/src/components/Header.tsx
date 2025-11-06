import React, { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to add shadow and change background slightly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg"
          : "bg-gradient-to-r from-indigo-600 to-purple-600"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Gig<span className="text-yellow-300">Connect</span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-white text-lg font-medium">
          <a href="#" className="hover:text-yellow-300 transition">
            Home
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            Categories
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            Projects
          </a>
          <a href="#" className="hover:text-yellow-300 transition">
            Contact
          </a>
        </nav>

        {/* CTA Button */}
        <button className="hidden md:block bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
          Join Now
        </button>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-white text-3xl cursor-pointer">☰</div>
      </div>
    </header>
  );
};

export default Header;
