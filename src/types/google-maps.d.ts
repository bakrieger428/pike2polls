/**
 * Google Maps Platform API Type Definitions
 * Types for the Google Maps Places API PlaceAutocompleteElement
 */

declare global {
  interface Window {
    google?: {
      maps: {
        importLibrary: (library: string) => Promise<unknown>;
        places: {
          PlaceAutocompleteElement: new (options?: Record<string, unknown>) => PlaceAutocompleteElementInstance;
        };
      };
    };
  }
}

// PlaceAutocompleteElement instance interface
interface PlaceAutocompleteElementInstance {
  element: HTMLInputElement;
  addEventListener(
    event: string,
    handler: (event: { placePrediction: { toPlace: () => Place } }) => void
  ): void;
}

// Place result from PlaceAutocomplete
interface Place {
  formatted_address?: string;
  fetchFields(options: { fields: string[] }): Promise<void>;
  toJSON(): Record<string, unknown>;
}

export {};
