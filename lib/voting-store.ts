import { create } from "zustand";

interface VotingState {
  selectedCountries: string[];
  toggleCountry: (countryCode: string) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  removeCountry: (countryCode: string) => void;
  setCountries: (countries: string[]) => void;
  reset: () => void;
}

export const useVotingStore = create<VotingState>((set) => ({
  selectedCountries: [],

  toggleCountry: (countryCode) =>
    set((state) => {
      if (state.selectedCountries.includes(countryCode)) {
        return {
          selectedCountries: state.selectedCountries.filter((c) => c !== countryCode),
        };
      }
      if (state.selectedCountries.length >= 5) {
        return state;
      }
      return {
        selectedCountries: [...state.selectedCountries, countryCode],
      };
    }),

  moveUp: (index) =>
    set((state) => {
      if (index === 0) return state;
      const newOrder = [...state.selectedCountries];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return { selectedCountries: newOrder };
    }),

  moveDown: (index) =>
    set((state) => {
      if (index === state.selectedCountries.length - 1) return state;
      const newOrder = [...state.selectedCountries];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return { selectedCountries: newOrder };
    }),

  removeCountry: (countryCode) =>
    set((state) => ({
      selectedCountries: state.selectedCountries.filter((c) => c !== countryCode),
    })),

  setCountries: (countries) => set({ selectedCountries: countries }),

  reset: () => set({ selectedCountries: [] }),
}));
