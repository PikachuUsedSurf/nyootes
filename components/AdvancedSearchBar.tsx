'use client';

import React, { useState } from 'react';
import { SearchFilters } from '../types';

interface AdvancedSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  tags: string[];
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  filters,
  onFiltersChange,
  tags,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ query });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: newTags });
  };

  const handleSearchInChange = (field: 'title' | 'content' | 'tags') => {
    const newSearchIn = filters.searchIn.includes(field)
      ? filters.searchIn.filter(f => f !== field)
      : [...filters.searchIn, field];
    onFiltersChange({ searchIn: newSearchIn });
  };

  const handleDateRangeChange = (type: 'start' | 'end', date: string) => {
    const newDateRange = {
      ...filters.dateRange,
      [type]: date ? new Date(date) : undefined,
    };
    onFiltersChange({ dateRange: newDateRange });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      tags: [],
      dateRange: {},
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      searchIn: ['title', 'content', 'tags'],
    });
  };

  const hasActiveFilters = filters.query || filters.tags.length > 0 || 
    filters.dateRange.start || filters.dateRange.end ||
    filters.searchIn.length !== 3 || filters.sortBy !== 'updatedAt' || 
    filters.sortOrder !== 'desc';

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full px-4 py-2 pl-10 form-input rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
            className="px-3 py-2 form-input rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as any })}
            className="px-3 py-2 form-input rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'btn-secondary'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="card p-4 space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Advanced Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Search in fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search In:
            </label>
            <div className="flex flex-wrap gap-2">
              {(['title', 'content', 'tags'] as const).map((field) => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.searchIn.includes(field)}
                    onChange={() => handleSearchInChange(field)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {field}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 form-input rounded-lg"
                  placeholder="Start date"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 form-input rounded-lg"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Tags filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Query: "{filters.query}"
              <button
                onClick={() => handleQueryChange('')}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            >
              Tag: {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                ×
              </button>
            </span>
          ))}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Date: {filters.dateRange.start?.toLocaleDateString()} - {filters.dateRange.end?.toLocaleDateString()}
              <button
                onClick={() => onFiltersChange({ dateRange: {} })}
                className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};