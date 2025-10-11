/**
 * Component displaying map usage instructions
 */
export function MapInstructions() {
  return (
    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Click on countries to select them
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Red pins show selection order</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag to pan • Scroll to zoom</p>
    </div>
  );
}
