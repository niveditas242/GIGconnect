const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8 text-center text-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-lg font-semibold tracking-wide">
          © {new Date().getFullYear()} GigConnect. All Rights Reserved.
        </p>
        <div className="mt-3 space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-blue-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
