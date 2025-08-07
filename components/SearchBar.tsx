interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  tags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  sortOrder,
  onSortChange,
  tags,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={selectedTag}
          onChange={(e) => onTagChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
};