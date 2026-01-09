/**
 * Reusable FilterControls component for TodoApp.
 *
 * Provides filtering options for tasks (All, Active, Completed).
 */

import { Button } from "./ui/Button";

interface FilterControlsProps {
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

export default function FilterControls({
  filter,
  onFilterChange,
}: FilterControlsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={filter === "all" ? "primary" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "primary" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "primary" : "outline"}
        size="sm"
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
}