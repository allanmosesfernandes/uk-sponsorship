import type { Metadata } from "next";
import Link from "next/link";
import { loadCompanies } from "@/lib/companies";
import { fusedCompanies } from "@/lib/search";

// TODO: derive this from the CSV filename/data instead of hardcoding (see MISSION "then" list).
const LAST_UPDATED = "5th June 2026";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

// Give searched pages a descriptive <title>, but keep every query-string
// variant canonicalised to "/" (inherited from the root layout) so search
// engines consolidate them into a single indexed page.
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const search = (await searchParams).search?.trim();
  if (!search) return {};
  return {
    title: `Sponsor licence results for “${search}”`,
    description: `Companies matching “${search}” in the official gov.uk register of licensed UK visa sponsors, with their sponsor licence rating and visa routes.`,
  };
}

// One label/value row of the brutalist data table.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[140px_1fr] border-b-2 border-foreground last:border-b-0">
      <dt className="border-r-2 border-foreground px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        {label}
      </dt>
      <dd className="px-3 py-2 text-xs sm:text-sm uppercase wrap-break-word">{children}</dd>
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchParam = params.search;
  
  const results = searchParam
    ? fusedCompanies.search(searchParam).map(result => result.item).slice(0, 50)
    : [];

  return (
    <div className="flex min-h-screen flex-col">

      {/* Wordmark header */}
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex w-full max-w-3xl items-end justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
              UK Visa Sponsor Checker
            </h1>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              Official UKVI Register ◆ Live Data
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] opacity-60 sm:text-xs">
              Last Updated: {LAST_UPDATED}
            </p>
          </div>
          <Link
            href="/about"
            className="shrink-0 border-2 border-foreground px-3 py-1 text-xs font-bold uppercase transition-opacity hover:opacity-80"
          >
            About
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">

        {/* Search */}
        <form method="get" className="flex border-2 border-foreground">
          <input
            type="search"
            name="search"
            defaultValue={searchParam ?? ""}
            placeholder="Enter a company name…"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm uppercase outline-none placeholder:text-foreground/50"
          />
          <button
            type="submit"
            className="shrink-0 border-l-2 border-foreground bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-80"
          >
            Search
          </button>
        </form>

        {/* Before any search */}
        {!searchParam && (
          <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] opacity-60">
            ◆ Type a company name to check its sponsor status ◆
          </p>
        )}

        {/* No matches */}
        {searchParam && results.length === 0 && (
          <div className="mt-8 border-2 border-dashed border-foreground p-8 text-center text-xs uppercase tracking-widest">
            No sponsors found for “{searchParam}”
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <p className="mb-4 mt-8 text-[10px] font-bold uppercase tracking-[0.2em]">
              ◆ {results.length} {results.length === 1 ? "Sponsor" : "Sponsors"} Found
            </p>
            <ul className="space-y-5">
              {results.map(company => {
                const grade = company.type.includes("A rating")
                  ? "A"
                  : company.type.includes("B rating")
                    ? "B"
                    : "–";
                return (
                  <li key={company.companyName} className="border-2 border-foreground">
                    {/* Company name bar */}
                    <div className="flex items-stretch justify-between border-b-2 border-foreground">
                      <h2 className="px-3 py-2 text-sm font-bold uppercase wrap-break-word sm:text-base">
                        {company.companyName}
                      </h2>
                      <span className="flex shrink-0 items-center border-l-2 border-foreground bg-foreground px-4 text-lg font-bold text-background">
                        {grade}
                      </span>
                    </div>

                    {/* Data table */}
                    <dl>
                      <Field label="Location">
                        {[company.city, company.county].filter(Boolean).join(", ")}
                      </Field>
                      <Field label="Licence">{company.type}</Field>
                      <Field label="Routes">
                        {company.companyRoutes.join(" ◆ ")}
                      </Field>
                    </dl>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      <footer className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[10px] uppercase tracking-[0.2em] opacity-60">
        <span>◆ Data: gov.uk register of licensed sponsors (workers)</span>
        <Link href="/about" className="underline underline-offset-2 hover:opacity-100">
          About &amp; FAQ
        </Link>
      </footer>
    </div>
  );
}
