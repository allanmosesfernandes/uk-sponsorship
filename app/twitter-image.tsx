// Reuse the OpenGraph image for the Twitter/X card to avoid duplication.
// `dynamic` must be declared literally per-route (it can't be re-exported).
export const dynamic = "force-static";
export { default, alt, size, contentType } from "./opengraph-image";
