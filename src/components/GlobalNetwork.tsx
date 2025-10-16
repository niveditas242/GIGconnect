import React from "react";
import { motion } from "framer-motion";

const GlobalNetwork: React.FC = () => {
  return (
    <section className="relative py-20 bg-gray-900">
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-6 text-white">
          Tap into a global talent network
        </h2>
        <p className="text-gray-300 text-lg">
          Connect with skilled professionals from around the world to get your
          projects done efficiently.
        </p>
      </motion.div>
    </section>
  );
};

export default GlobalNetwork;
