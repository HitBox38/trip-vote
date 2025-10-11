import { Globe } from "lucide-react";

/**
 * Header component for the session info page
 */
export function SessionHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
        <Globe className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Trip Vote</h1>
      <p className="text-gray-600 dark:text-gray-300">Help decide the next travel destination</p>
    </div>
  );
}
