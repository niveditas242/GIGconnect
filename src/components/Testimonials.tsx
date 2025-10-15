import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alice",
    feedback: "GigConnect made hiring local freelancers so easy!",
  },
  { name: "Bob", feedback: "I found the perfect freelancer within hours." },
  { name: "Charlie", feedback: "Professional and reliable platform!" },
];

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-3xl mx-auto text-center px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          What People Say
        </motion.h2>

        <motion.div
          key={current}
          className="bg-white p-8 rounded-2xl shadow-lg transition-opacity duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-700 mb-4">{testimonials[current].feedback}</p>
          <span className="font-semibold text-gray-900">
            — {testimonials[current].name}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
