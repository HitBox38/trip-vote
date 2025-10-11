import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook for managing accordion open state
 * @param selectedCountriesLength - Number of selected countries
 * @param isDesktop - Whether device is desktop
 * @returns Object with openItems state and setter
 */
export function useAccordionState(selectedCountriesLength: number, isDesktop: boolean) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const prevCountriesLengthRef = useRef(0);

  useEffect(() => {
    const items: string[] = [];
    if (!isDesktop) items.push("search");
    if (isDesktop) items.push("map");
    if (selectedCountriesLength > 0) items.push("rank");
    setOpenItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prevLength = prevCountriesLengthRef.current;
    const currentLength = selectedCountriesLength;

    if (prevLength === 0 && currentLength > 0 && !openItems.includes("rank")) {
      setOpenItems((prev) => [...prev, "rank"]);
    }

    prevCountriesLengthRef.current = currentLength;
  }, [selectedCountriesLength, openItems]);

  return { openItems, setOpenItems };
}

/**
 * Hook for handling form submission redirect
 * @param state - Form action state
 */
export function useSubmissionRedirect(state: unknown) {
  const router = useRouter();

  useEffect(() => {
    if (state && typeof state === "object" && "success" in state && state.success === true) {
      if ("redirectUrl" in state && typeof state.redirectUrl === "string") {
        router.push(state.redirectUrl);
      }
    }
  }, [state, router]);
}

/**
 * Hook for detecting desktop vs mobile
 * @returns Boolean indicating if device is desktop
 */
export function useDesktopDetection() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

/**
 * Hook for fetching reachable destinations
 * @param originCountry - Origin country code
 * @returns Object with destinations data and loading state
 */
export function useDestinations(originCountry?: string) {
  return useQuery({
    queryKey: ["destinations", originCountry],
    queryFn: async () => {
      if (!originCountry) return null;

      const response = await fetch(`/api/destinations?origin=${originCountry}`);
      if (!response.ok) throw new Error("Failed to fetch destinations");

      return response.json();
    },
    enabled: !!originCountry,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Hook for fetching session, participant, and existing vote data
 * @param sessionId - Session ID
 * @param participantId - Participant ID
 * @returns Object with session, participant, and existingVote data
 */
export function useVotingData(sessionId: string, participantId: string) {
  const session = useConvexQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const participant = useConvexQuery(api.participants.get, {
    participantId: participantId as Id<"participants">,
  });
  const existingVote = useConvexQuery(api.votes.getByParticipant, {
    participantId: participantId as Id<"participants">,
  });

  return { session, participant, existingVote };
}
