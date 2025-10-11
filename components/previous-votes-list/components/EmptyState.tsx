import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

/**
 * Component displaying empty state when no sessions exist
 */
export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Previous Votes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven&apos;t participated in any voting sessions yet.
          </p>
          <Button asChild>
            <Link href="/">Create Your First Vote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
