"use client";

import { useActionState, useEffect } from "react";
import { submitVotes } from "@/app/actions";
import { useVotingStore } from "@/lib/voting-store";
import { Prop } from "./types";
import {
  getCountryName,
  getEligibleCountries,
  countriesToOptions,
  codesToOptions,
  createDragEndHandler,
} from "./helpers";
import { VotingHeader } from "./components/VotingHeader";
import { VotingSections } from "./components/VotingSections";
import {
  useAccordionState,
  useSubmissionRedirect,
  useDesktopDetection,
  useDestinations,
  useVotingData,
} from "./hooks";

/**
 * Main voting interface component
 * @param sessionId - The unique identifier for the voting session
 * @param participantId - The unique identifier for the participant
 * @param creatorId - Optional creator ID if the participant is the creator
 */
export function VotingInterface({ sessionId, participantId, creatorId }: Prop) {
  const { selectedCountries, toggleCountry, removeCountry, setCountries } = useVotingStore();
  const [state, formAction, isPending] = useActionState(submitVotes, null);
  const isDesktop = useDesktopDetection();
  const { openItems, setOpenItems } = useAccordionState(selectedCountries.length, isDesktop);

  const { session, participant, existingVote } = useVotingData(sessionId, participantId);
  const { data: destinationsData, isLoading: loadingDestinations } = useDestinations(
    session?.originCountry
  );

  useSubmissionRedirect(state);

  useEffect(() => {
    if (existingVote?.countries && existingVote.countries.length > 0) {
      setCountries(existingVote.countries);
    }
  }, [existingVote, setCountries]);

  const reachableCountries = destinationsData?.destinations || [];
  const eligibleCountries = getEligibleCountries(session?.originCountry, reachableCountries);
  const countryOptions = countriesToOptions(eligibleCountries);
  const selectedOptions = codesToOptions(selectedCountries);
  const handleDragEnd = createDragEndHandler(selectedCountries, setCountries);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <VotingHeader
        username={participant?.username}
        isEditing={!!existingVote}
        originCountry={session?.originCountry}
        loadingDestinations={loadingDestinations}
        eligibleCountriesCount={eligibleCountries.length}
        destinationStats={destinationsData?.stats}
        getCountryName={getCountryName}
      />
      <VotingSections
        openItems={openItems}
        onOpenItemsChange={setOpenItems}
        selectedOptions={selectedOptions}
        countryOptions={countryOptions}
        selectedCount={selectedCountries.length}
        onSelectionChange={(options) => setCountries(options.map((opt) => opt.value))}
        selectedCountries={selectedCountries}
        canSelect={selectedCountries.length < 5}
        eligibleCountries={eligibleCountries}
        onCountryClick={toggleCountry}
        getCountryName={getCountryName}
        onDragEnd={handleDragEnd}
        onRemoveCountry={removeCountry}
        isPending={isPending}
        sessionId={sessionId}
        participantId={participantId}
        creatorId={creatorId}
        isEditing={!!existingVote}
        formAction={formAction}
        errors={state?.errors}
      />
    </div>
  );
}
