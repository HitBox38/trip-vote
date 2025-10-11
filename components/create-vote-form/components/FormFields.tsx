import { useState } from "react";
import { Control } from "react-hook-form";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Users, MapPin, ChevronsUpDown, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormValues } from "../types";

interface Prop {
  /** React Hook Form control object */
  control: Control<FormValues>;
  /** Whether the form is currently submitting */
  isPending: boolean;
}

/**
 * Component containing form fields for vote creation
 * @param control - React Hook Form control object
 * @param isPending - Whether the form is currently submitting
 */
export function FormFields({ control, isPending }: Prop) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name="creatorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <Input type="text" placeholder="Enter your name" className="pl-10" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              If provided, you&apos;ll skip the name entry step when voting
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="maxParticipants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Participants</FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="number"
                  min={2}
                  max={20}
                  className="pl-10"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </div>
            </FormControl>
            <FormDescription>Choose between 2-20 participants</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="originCountry"
        render={({ field }) => {
          const sortedCountries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
          const selectedCountry = sortedCountries.find((c) => c.code === field.value);

          return (
            <FormItem className="flex flex-col">
              <FormLabel>Country of Origin (Optional)</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>
                          {selectedCountry?.name || "No restriction - All countries available"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            field.onChange("");
                            setOpen(false);
                          }}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          No restriction - All countries available
                        </CommandItem>
                        {sortedCountries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              field.onChange(country.code);
                              setOpen(false);
                            }}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <input type="hidden" name="originCountry" value={field.value || ""} />
              <FormDescription>
                If set, voters can only select countries accessible with this passport (visa-free,
                visa-on-arrival, or e-visa)
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Vote Session"}
      </Button>
    </>
  );
}
