"use server";

import { Client } from "@googlemaps/google-maps-services-js";

export const autocomplete = async (input: string) => {
  const client = new Client();
  const key = process.env.MAPS_API_KEY as string;
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({ params: { input, key } });
    return response.data.predictions;
  } catch (error) {
    console.error(error);
  }
};
