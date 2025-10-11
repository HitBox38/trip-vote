import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "./SortableItem";

interface Prop {
  /** Array of selected country codes in order */
  selectedCountries: string[];
  /** Function to get country name from code */
  getCountryName: (code: string) => string;
  /** Callback when drag ends */
  onDragEnd: (event: DragEndEvent) => void;
  /** Callback to remove a country */
  onRemoveCountry: (code: string) => void;
  /** Whether voting is in progress */
  isPending: boolean;
  /** Session ID */
  sessionId: string;
  /** Participant ID */
  participantId: string;
  /** Optional creator ID */
  creatorId?: string;
  /** Whether user is editing an existing vote */
  isEditing: boolean;
  /** Server action for form submission */
  formAction: (payload: FormData) => void;
  /** Validation errors */
  errors?: { countries?: string[] };
}

/**
 * Ranking section for ordering selected countries
 * @param selectedCountries - Array of selected country codes in order
 * @param getCountryName - Function to get country name from code
 * @param onDragEnd - Callback when drag ends
 * @param onRemoveCountry - Callback to remove a country
 * @param isPending - Whether voting is in progress
 * @param sessionId - Session ID
 * @param participantId - Participant ID
 * @param creatorId - Optional creator ID
 * @param isEditing - Whether user is editing an existing vote
 * @param formAction - Server action for form submission
 * @param errors - Validation errors
 */
export function RankingSection({
  selectedCountries,
  getCountryName,
  onDragEnd,
  onRemoveCountry,
  isPending,
  sessionId,
  participantId,
  creatorId,
  isEditing,
  formAction,
  errors,
}: Prop) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
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
                onDragEnd={onDragEnd}
                modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={selectedCountries} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {selectedCountries.map((countryCode, index) => (
                      <SortableItem
                        key={countryCode}
                        id={countryCode}
                        index={index}
                        countryName={getCountryName(countryCode)}
                        onRemove={() => onRemoveCountry(countryCode)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {errors?.countries && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.countries[0]}</p>
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
                  ? isEditing
                    ? "Updating..."
                    : "Submitting..."
                  : isEditing
                    ? "Update Your Vote"
                    : "Submit Your Vote"}
              </Button>
            </form>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
