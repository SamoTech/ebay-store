'use client';

import { useState } from 'react';

export interface FilterOptions {
  priceMin: number;
  priceMax: number;
  brands: string[];
  condition: 'all' | 'new' | 'refurbished' | 'used';
  minDiscount: number;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'discount';
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClose?: () => void;
}

const popularBrands = [
  'Apple', 'Samsung', 'Sony', 'Microsoft', 'Nintendo',
  'Nike', 'Adidas', 'Lego', 'Dyson', 'Dell', 'HP', 'Bose'
];

export default function FilterSidebar({ onFilterChange, onClose }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceMin: 0,
    priceMax: 5000,
    brands: [],
    condition: 'all',
    minDiscount: 0,
    sortBy: 'popular'
  });

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    if (onClose) onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      priceMin: 0,
      priceMax: 5000,
      brands: [],
      condition: 'all',
      minDiscount: 0,
      sortBy: 'popular'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            ✕
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>${filters.priceMin}</span>
            <span>${filters.priceMax}+</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Brands
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {popularBrands.map(brand => (
            <label key={brand} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Condition
        </label>
        <select
          value={filters.condition}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value as FilterOptions['condition'] })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Conditions</option>
          <option value="new">New Only</option>
          <option value="refurbished">Refurbished</option>
          <option value="used">Used/Pre-Owned</option>
        </select>
      </div>

      {/* Minimum Discount */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Minimum Discount
        </label>
        <select
          value={filters.minDiscount}
          onChange={(e) => setFilters({ ...filters, minDiscount: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="0">Any Discount</option>
          <option value="10">10% or more</option>
          <option value="20">20% or more</option>
          <option value="30">30% or more</option>
          <option value="50">50% or more</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Active Filters Count */}
      {(filters.brands.length > 0 || filters.minDiscount > 0 || filters.condition !== 'all') && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {filters.brands.length + (filters.minDiscount > 0 ? 1 : 0) + (filters.condition !== 'all' ? 1 : 0)} active filter(s)
        </div>
      )}
    </div>
  );
}
