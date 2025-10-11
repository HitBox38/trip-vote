import { Trophy, Medal, Award, MapPin } from "lucide-react";
import { createElement } from "react";

/**
 * Returns the appropriate medal icon for a given rank
 * @param index - The index/rank (0-based) of the result
 * @returns JSX element representing the medal icon
 */
export function getMedalIcon(index: number) {
  switch (index) {
    case 0:
      return createElement(Trophy, { className: "w-6 h-6 text-yellow-500" });
    case 1:
      return createElement(Medal, { className: "w-6 h-6 text-gray-400" });
    case 2:
      return createElement(Award, { className: "w-6 h-6 text-amber-600" });
    default:
      return createElement(MapPin, { className: "w-5 h-5 text-gray-400" });
  }
}
