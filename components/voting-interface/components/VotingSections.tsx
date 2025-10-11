import { Accordion } from "@/components/ui/accordion";
import { Option } from "@/components/ui/multiselect";
import { DragEndEvent } from "@dnd-kit/core";
import { SearchSection } from "./SearchSection";
import { MapSection } from "./MapSection";
import { RankingSection } from "./RankingSection";

interface Prop {
  /** Array of open accordion items */
  openItems: string[];
  /** Callback when open items change */
  onOpenItemsChange: (items: string[]) => void;
  /** Selected country options */
  selectedOptions: Option[];
  /** All country options */
  countryOptions: Option[];
  /** Number of selected countries */
  selectedCount: number;
  /** Callback when selection changes */
  onSelectionChange: (options: Option[]) => void;
  /** Array of selected country codes */
  selectedCountries: string[];
  /** Whether more countries can be selected */
  canSelect: boolean;
  /** Array of eligible countries */
  eligibleCountries: readonly { code: string; name: string; lat: number; lon: number }[];
  /** Callback when country is clicked */
  onCountryClick: (code: string) => void;
  /** Function to get country name */
  getCountryName: (code: string) => string;
  /** Drag end handler */
  onDragEnd: (event: DragEndEvent) => void;
  /** Remove country handler */
  onRemoveCountry: (code: string) => void;
  /** Whether form is submitting */
  isPending: boolean;
  /** Session ID */
  sessionId: string;
  /** Participant ID */
  participantId: string;
  /** Creator ID */
  creatorId?: string;
  /** Whether editing existing vote */
  isEditing: boolean;
  /** Form action */
  formAction: (payload: FormData) => void;
  /** Form errors */
  errors?: { countries?: string[] };
}

/**
 * Component containing all voting sections in an accordion
 */
export function VotingSections({
  openItems,
  onOpenItemsChange,
  selectedOptions,
  countryOptions,
  selectedCount,
  onSelectionChange,
  selectedCountries,
  canSelect,
  eligibleCountries,
  onCountryClick,
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
  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={onOpenItemsChange}
      className="space-y-6">
      <SearchSection
        selectedOptions={selectedOptions}
        countryOptions={countryOptions}
        selectedCount={selectedCount}
        onChange={onSelectionChange}
      />
      <MapSection
        selectedCountries={selectedCountries}
        selectedCount={selectedCount}
        canSelect={canSelect}
        eligibleCountries={eligibleCountries}
        onCountryClick={onCountryClick}
      />
      <RankingSection
        selectedCountries={selectedCountries}
        getCountryName={getCountryName}
        onDragEnd={onDragEnd}
        onRemoveCountry={onRemoveCountry}
        isPending={isPending}
        sessionId={sessionId}
        participantId={participantId}
        creatorId={creatorId}
        isEditing={isEditing}
        formAction={formAction}
        errors={errors}
      />
    </Accordion>
  );
}
