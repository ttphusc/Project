import React, { useState } from "react";

const SearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Sample data to search from (replace with your data source)
  const sampleData = [
    "Apple Pie",
    "Banana Bread",
    "Cherry Tart",
    "Doughnuts",
    "Eclair",
    "French Toast",
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      // Filter results based on input
      const filtered = sampleData.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectItem = (item) => {
    setSearchTerm(item);
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div className="relative w-[300px]">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search something..."
        className="w-full border-2 border-[#839DD1] rounded-lg p-2 focus:outline-none"
      />
      {showDropdown && filteredResults.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 border border-gray-300 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredResults.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectItem(item)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
