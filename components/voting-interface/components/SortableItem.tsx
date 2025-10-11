import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";

interface Prop {
  /** Unique identifier for the item */
  id: string;
  /** Index in the list (0-based) */
  index: number;
  /** Name of the country */
  countryName: string;
  /** Callback when remove button is clicked */
  onRemove: () => void;
}

/**
 * Sortable item component for drag-and-drop ranking
 * @param id - Unique identifier for the item
 * @param index - Index in the list (0-based)
 * @param countryName - Name of the country
 * @param onRemove - Callback when remove button is clicked
 */
export function SortableItem({ id, index, countryName, onRemove }: Prop) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg touch-none">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        {...attributes}
        {...listeners}>
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
        {index + 1}
      </div>
      <span className="flex-1 font-medium text-sm">{countryName}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
