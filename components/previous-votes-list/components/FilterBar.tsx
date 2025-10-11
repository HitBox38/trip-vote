import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterOption } from "../types";

interface Prop {
  /** Current filter value */
  filter: FilterOption;
  /** Callback when filter changes */
  onFilterChange: (value: FilterOption) => void;
  /** Total number of sessions */
  totalSessions: number;
  /** Number of voted sessions */
  votedCount: number;
  /** Number of joined-only sessions */
  joinedCount: number;
  /** Number of filtered results */
  filteredCount: number;
}

/**
 * Component for filtering and displaying session counts
 * @param filter - Current filter value
 * @param onFilterChange - Callback when filter changes
 * @param totalSessions - Total number of sessions
 * @param votedCount - Number of voted sessions
 * @param joinedCount - Number of joined-only sessions
 * @param filteredCount - Number of filtered results
 */
export function FilterBar({
  filter,
  onFilterChange,
  totalSessions,
  votedCount,
  joinedCount,
  filteredCount,
}: Prop) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filter} onValueChange={(value) => onFilterChange(value as FilterOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions ({totalSessions})</SelectItem>
            <SelectItem value="voted">Voted ({votedCount})</SelectItem>
            <SelectItem value="joined-only">Joined Only ({joinedCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCount} {filteredCount === 1 ? "session" : "sessions"}
      </p>
    </div>
  );
}
