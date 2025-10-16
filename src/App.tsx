import "./App.css";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import CategoriesGrid from "./components/CategoriesGrid";
import HowItWorks from "./components/HowItWorks";
import GlobalNetwork from "./components/GlobalNetwork";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroBanner />
      <CategoriesGrid />
      <HowItWorks />
      <GlobalNetwork />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
