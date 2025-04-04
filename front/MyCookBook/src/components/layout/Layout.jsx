import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="bg-background flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
