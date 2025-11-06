import Navbar from "../Navbar";
import Footer from "../Footer";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-slate-900 to-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-grow pt-20">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
