import React from "react";

const benefits = [
  "Find local experts quickly",
  "Affordable pricing",
  "Flexible scheduling",
  "Trusted community",
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16 px-6">
      <h3 className="text-3xl font-bold text-center mb-8">
        Benefits of Using GigConnect
      </h3>
      <ul className="max-w-3xl mx-auto space-y-4 list-disc list-inside text-lg">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </section>
  );
};

export default BenefitsSection;
