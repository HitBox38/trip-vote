import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface Prop {
  /** Currently selected options */
  selectedOptions: Option[];
  /** All available options */
  countryOptions: Option[];
  /** Number of selected countries */
  selectedCount: number;
  /** Callback when selection changes */
  onChange: (options: Option[]) => void;
}

/**
 * Search and select section for choosing countries
 * @param selectedOptions - Currently selected options
 * @param countryOptions - All available options
 * @param selectedCount - Number of selected countries
 * @param onChange - Callback when selection changes
 */
export function SearchSection({ selectedOptions, countryOptions, selectedCount, onChange }: Prop) {
  return (
    <AccordionItem value="search" className="border-none">
      <Card>
        <CardHeader>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start gap-1">
              <CardTitle>Search & Select Countries</CardTitle>
              <CardDescription>
                Search and select destinations ({selectedCount}/5 selected)
              </CardDescription>
            </div>
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent>
          <CardContent>
            <MultipleSelector
              value={selectedOptions}
              onChange={onChange}
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
  );
}
