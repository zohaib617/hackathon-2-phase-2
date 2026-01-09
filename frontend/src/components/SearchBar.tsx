/**
 * Reusable SearchBar component for TodoApp.
 *
 * Provides search functionality for tasks by title or description.
 */

import { Input } from "./ui/Input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search tasks...",
}: SearchBarProps) {
  return (
    <Input
      label="Search"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  );
}