import React from "react";
import { motion } from "framer-motion";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-[url('https://via.placeholder.com/1600x800')] bg-cover bg-center h-screen flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="container mx-auto relative z-10 max-w-lg text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Hire the best freelancers for any job, online.
        </motion.h1>
        <ul className="list-disc ml-5 mb-6 space-y-2">
          <li>World's largest freelancing marketplace</li>
          <li>Save up to 90% on hiring costs</li>
          <li>Pay no fees until work is delivered</li>
        </ul>
        <div className="flex gap-4">
          <motion.a
            href="#"
            className="px-6 py-3 bg-accent rounded text-white font-semibold hover:bg-pink-600 transition"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hire a Freelancer
          </motion.a>
          <motion.a
            href="#"
            className="px-6 py-3 border border-accent text-accent rounded font-semibold hover:bg-accent hover:text-white transition"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            Earn Money Freelancing
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
