import { addCity, addCountry, atlasCountries, readPlaces } from "@/lib/editor/places";
import { editorRoute } from "../_respond";

export const dynamic = "force-dynamic";

export const GET = editorRoute(async () => ({ ...(await readPlaces()), atlas: atlasCountries() }));

export const POST = editorRoute(async (request) => {
  const { kind, ...input } = await request.json();
  if (kind === "country") return addCountry(input);
  if (kind === "city") return addCity(input);
  throw new Error(`Unknown kind: ${kind}`);
});
