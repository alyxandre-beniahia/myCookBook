import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#262633] mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-primary-600">myCookBook</h2>
            <p className="text-sm text-white">Share your culinary creations</p>
          </div>
          <div className="text-sm text-white">
            &copy; {new Date().getFullYear()} myCookBook. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
