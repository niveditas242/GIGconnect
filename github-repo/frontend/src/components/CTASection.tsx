import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 animate-gradient-x opacity-40"></div>
      <a
        href="#hire"
        className="relative px-8 py-4 bg-white text-black font-semibold rounded transform hover:scale-105 transition duration-300 animate-pulse hover:animate-none"
      >
        Hire a Freelancer
      </a>
    </section>
  );
};

export default CTASection;
