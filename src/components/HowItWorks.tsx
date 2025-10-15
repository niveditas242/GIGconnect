import React from "react";
import { motion } from "framer-motion";

const steps = [
  { title: "Post a Project", desc: "Describe your project and requirements." },
  {
    title: "Hire Talent",
    desc: "Select the best freelancer for your project.",
  },
  { title: "Get Work Done", desc: "Review work and make payments securely." },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-100 p-8 rounded-2xl shadow-lg flex-1 transition transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
