import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import GooeyNav from "./GooeyNav";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define navigation items based on user authentication status
  const getNavItems = () => {
    const baseItems = [
      { label: "Home", href: "/" },
      { label: "Search", href: "/recipes/search" },
    ];

    const authItems = user
      ? [
          ...baseItems,
          { label: "Favorites", href: "/favorites" },
          { label: "Add Recipe", href: "/recipes/create" },
          { label: "Logout", href: "#logout" }, // Special handling for logout
        ]
      : [
          ...baseItems,
          { label: "Login", href: "/login" },
          { label: "Register", href: "/register" },
        ];

    return authItems;
  };

  // Update active index based on current location
  useEffect(() => {
    const navItems = getNavItems();
    const currentPath = location.pathname;

    // Find the index of the current path in our nav items
    const index = navItems.findIndex((item) => {
      if (item.href === "#logout") return false;
      if (item.href === "/" && currentPath === "/") return true;
      return currentPath.startsWith(item.href);
    });

    // If found, update the active index
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname, user]);

  // Custom navigation handler
  const handleNavigation = (item) => {
    if (item.href === "#logout") {
      logout();
      navigate("/");
    } else {
      navigate(item.href);
    }
  };

  return (
    <header className="bg-[#262633] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-white">myCookBook</h1>
            </Link>
          </div>

          {/* Desktop navigation with GooeyNav - all white */}
          <div className="hidden md:flex items-center">
            <div style={{ position: "relative" }}>
              <GooeyNav
                items={getNavItems().map((item) => ({
                  ...item,
                  onClick: () => handleNavigation(item),
                }))}
                animationTime={600}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                timeVariance={300}
                colors={["white", "white", "white", "white"]} // All white particles
                initialActiveIndex={activeIndex}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {getNavItems().map((item, index) => (
              <Link
                key={index}
                to={item.href === "#logout" ? "/" : item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  index === activeIndex
                    ? "bg-gray-700 text-white"
                    : "text-white hover:text-gray-300"
                }`}
                onClick={(e) => {
                  if (item.href === "#logout") {
                    e.preventDefault();
                    logout();
                  }
                  toggleMenu();
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
