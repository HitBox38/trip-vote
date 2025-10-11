import { CreateVoteForm } from "@/components/create-vote-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe, History } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSavedUsername } from "@/app/actions";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const savedUsername = await getSavedUsername();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Trip Vote",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web Browser",
    description:
      "Collaborative voting app to help groups decide their next travel destination together",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Create collaborative vote sessions",
      "Real-time voting and results",
      "Interactive world map selection",
      "Ranking system for preferences",
      "Share results with groups",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="fixed top-4 right-4 flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              Previous Votes
            </Link>
          </Button>
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
            <CreateVoteForm defaultName={savedUsername} />
          </div>
        </div>
      </div>
    </>
  );
}
