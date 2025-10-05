import { CreateVoteForm } from "@/components/create-vote-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Trip Vote</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Decide your next travel destination together
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create a Vote
          </h2>
          <CreateVoteForm />
        </div>
      </div>
    </div>
  );
}
