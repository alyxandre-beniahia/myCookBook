import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GooeyButton from "../layout/GooeyButton";

const RecipeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const params = {};
    if (searchQuery) params.query = searchQuery;
    if (selectedCategory) params.category = selectedCategory;

    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSearchParams({});
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#262633] mb-4">Find Recipes</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or ingredients"
            className="w-full px-4 py-2 pl-10 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        <GooeyButton
          onClick={handleSearch}
          className="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          particleCount={15}
          particleDistances={[80, 20]}
          hoverColor="#262633"
        >
          Search
        </GooeyButton>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-[#262633] mb-2">
          Filter by category:
        </p>
        <div className="flex flex-wrap gap-2">
          {["entrée", "plat", "dessert"].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
          {(selectedCategory || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearch;
