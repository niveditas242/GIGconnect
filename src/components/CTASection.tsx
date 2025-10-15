import React from "react";
import { motion } from "framer-motion";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-black text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Ready to Start?
      </motion.h2>
      <motion.p
        className="mb-6 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Join thousands of clients and freelancers connecting through GigConnect.
      </motion.p>
      <motion.a
        href="#"
        className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-pink-600 transition transform hover:scale-105"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Get Started
      </motion.a>
    </section>
  );
};

export default CTASection;
