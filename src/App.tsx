import React from "react";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import Brands from "./components/Brands";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import GlobalNetwork from "./components/GlobalNetwork";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <HeroBanner />
      <Brands />
      <Features />
      <Showcase />
      <GlobalNetwork />
      <CTASection />
      <Footer />
    </div>
  );
};

export default App;
