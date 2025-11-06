import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Local Freelancers",
    desc: "Find skilled professionals near you for faster communication and better trust.",
  },
  {
    title: "Secure Payments",
    desc: "We ensure safe and secure payments for every completed project.",
  },
  {
    title: "Verified Talent",
    desc: "Every freelancer is verified and reviewed for quality assurance.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          Why Choose GigConnect?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
