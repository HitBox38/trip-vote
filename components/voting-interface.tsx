"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitVotes } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COUNTRIES } from "@/lib/countries";
import { MapPin, Trash2, Loader2, GripVertical } from "lucide-react";
import { useVotingStore } from "@/lib/voting-store";
import { WorldMap } from "@/components/world-map";
import { useQuery as useConvexQuery } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface VotingInterfaceProps {
  sessionId: string;
  participantId: string;
  creatorId?: string;
}

interface SortableItemProps {
  id: string;
  index: number;
  countryName: string;
  onRemove: () => void;
}

function SortableItem({ id, index, countryName, onRemove }: SortableItemProps) {
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

export function VotingInterface({ sessionId, participantId, creatorId }: VotingInterfaceProps) {
  const { selectedCountries, toggleCountry, removeCountry, setCountries } = useVotingStore();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitVotes, null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const prevCountriesLengthRef = useRef(0);
  const session = useConvexQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const participant = useConvexQuery(api.participants.get, {
    participantId: participantId as Id<"participants">,
  });
  const existingVote = useConvexQuery(api.votes.getByParticipant, {
    participantId: participantId as Id<"participants">,
  });

  // Handle successful submission
  useEffect(() => {
    if (state && "success" in state && state.success === true) {
      if ("redirectUrl" in state && typeof state.redirectUrl === "string") {
        router.push(state.redirectUrl);
      }
    }
  }, [state, router]);

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = selectedCountries.indexOf(active.id as string);
      const newIndex = selectedCountries.indexOf(over.id as string);

      const newOrder = arrayMove(selectedCountries, oldIndex, newIndex);
      setCountries(newOrder);
    }
  };

  // Detect desktop vs mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Pre-populate with existing vote if available
  useEffect(() => {
    if (existingVote?.countries && existingVote.countries.length > 0) {
      setCountries(existingVote.countries);
    }
  }, [existingVote, setCountries]);

  // Initialize accordion open items based on desktop/mobile (only once)
  useEffect(() => {
    const items: string[] = [];

    // Search & Select: closed on desktop, open on mobile
    if (!isDesktop) {
      items.push("search");
    }

    // Map: open on desktop, closed on mobile
    if (isDesktop) {
      items.push("map");
    }

    // Rank: open if there are votes, closed if empty
    if (selectedCountries.length > 0) {
      items.push("rank");
    }

    setOpenItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open rank accordion when transitioning from 0 to 1+ countries
  useEffect(() => {
    const prevLength = prevCountriesLengthRef.current;
    const currentLength = selectedCountries.length;

    // Only auto-open when transitioning from 0 to 1+ countries
    if (prevLength === 0 && currentLength > 0 && !openItems.includes("rank")) {
      setOpenItems((prev) => [...prev, "rank"]);
    }

    // Update ref for next render
    prevCountriesLengthRef.current = currentLength;
  }, [selectedCountries.length, openItems]);

  const getCountryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name || code;

  // Fetch reachable countries using TanStack Query
  const { data: destinationsData, isLoading: loadingDestinations } = useQuery({
    queryKey: ["destinations", session?.originCountry],
    queryFn: async () => {
      if (!session?.originCountry) return null;

      const response = await fetch(`/api/destinations?origin=${session.originCountry}`);
      if (!response.ok) throw new Error("Failed to fetch destinations");

      return response.json();
    },
    enabled: !!session?.originCountry,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const reachableCountries = destinationsData?.destinations || [];

  // Filter countries based on origin country restriction and visa requirements
  const eligibleCountries: readonly { code: string; name: string; lat: number; lon: number }[] =
    session?.originCountry
      ? COUNTRIES.filter(
          (c) => c.code !== session.originCountry && reachableCountries.includes(c.code)
        )
      : COUNTRIES;

  // Convert countries to MultipleSelector options
  const countryOptions = useMemo<Option[]>(
    () =>
      [...eligibleCountries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((country) => ({
          value: country.code,
          label: country.name,
        })),
    [eligibleCountries]
  );

  // Convert selected countries to options
  const selectedOptions = useMemo<Option[]>(
    () =>
      selectedCountries.map((code) => ({
        value: code,
        label: getCountryName(code),
      })),
    [selectedCountries]
  );

  // Handle MultipleSelector change
  const handleSelectionChange = (options: Option[]) => {
    const countryCodes = options.map((opt) => opt.value);
    setCountries(countryCodes);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {existingVote ? "Edit Your Vote" : "Vote for Your Destinations"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-semibold">{participant?.username || "Voter"}</span>! Select
          up to 5 countries and rank them.
        </p>
        {existingVote && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            You&apos;re editing your previous response
          </p>
        )}
        {session?.originCountry && (
          <div className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex flex-col items-center justify-center gap-1">
            {loadingDestinations ? (
              <p className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading visa-free destinations from {getCountryName(session.originCountry)}...
              </p>
            ) : (
              <>
                <p>
                  Showing destinations accessible from {getCountryName(session.originCountry)} (
                  {eligibleCountries.length}{" "}
                  {eligibleCountries.length === 1 ? "country" : "countries"} available)
                </p>
                {destinationsData?.stats && (
                  <p className="text-xs opacity-75">
                    {destinationsData.stats.visaFree} visa-free ·{" "}
                    {destinationsData.stats.visaOnArrival} visa-on-arrival ·{" "}
                    {destinationsData.stats.eVisa} e-visa
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-6">
        {/* Country Search Combobox - Mobile Friendly */}
        <AccordionItem value="search" className="border-none">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Search & Select Countries</CardTitle>
                  <CardDescription>
                    Search and select destinations ({selectedCountries.length}/5 selected)
                  </CardDescription>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <MultipleSelector
                  value={selectedOptions}
                  onChange={handleSelectionChange}
                  options={countryOptions}
                  placeholder="Search countries..."
                  emptyIndicator={
                    <p className="text-center text-sm text-muted-foreground">No country found.</p>
                  }
                  maxSelected={5}
                  onMaxSelected={(count) => {
                    console.log(`Maximum ${count} countries already selected`);
                  }}
                />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Interactive World Map */}
        <AccordionItem value="map" className="border-none">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Select Countries on Map</CardTitle>
                  <CardDescription>
                    Click on up to 5 countries ({selectedCountries.length}/5 selected)
                  </CardDescription>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                <WorldMap
                  selectedCountries={selectedCountries}
                  onCountryClick={toggleCountry}
                  canSelect={selectedCountries.length < 5}
                  eligibleCountries={eligibleCountries}
                />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Ranking */}
        <AccordionItem value="rank" className="border-none">
          <Card>
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Rank Your Choices</CardTitle>
                  <CardDescription>Drag to reorder from most to least preferred</CardDescription>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                {selectedCountries.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select countries to start ranking</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}>
                    <SortableContext
                      items={selectedCountries}
                      strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {selectedCountries.map((countryCode, index) => (
                          <SortableItem
                            key={countryCode}
                            id={countryCode}
                            index={index}
                            countryName={getCountryName(countryCode)}
                            onRemove={() => removeCountry(countryCode)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {state?.errors?.countries && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {state.errors.countries[0]}
                  </p>
                )}

                <form action={formAction} className="mt-6">
                  <input type="hidden" name="sessionId" value={sessionId} />
                  <input type="hidden" name="participantId" value={participantId} />
                  {creatorId && <input type="hidden" name="creatorId" value={creatorId} />}
                  <input type="hidden" name="countries" value={JSON.stringify(selectedCountries)} />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || selectedCountries.length === 0}>
                    {isPending
                      ? existingVote
                        ? "Updating..."
                        : "Submitting..."
                      : existingVote
                        ? "Update Your Vote"
                        : "Submit Your Vote"}
                  </Button>
                </form>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
