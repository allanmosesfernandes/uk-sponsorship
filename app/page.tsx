import type { Metadata } from "next";
import Link from "next/link";
import { loadCompanies } from "@/lib/companies";
import { fusedCompanies } from "@/lib/search";
import { latestUpdate } from "@/lib/fetch-date";
import { pagination } from "@/lib/pagination";

const PAGE_SIZE = 25;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

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

function pageHref(page: number, search?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);   // keep the search term
  params.set("pageNo", String(page));         // set/replace the page
  return `?${params.toString()}`;             // -> "?search=acme&pageNo=2"
}

export default async function Home({ searchParams }: PageProps) {

  // Extract the params
  const params = await searchParams;
  const searchParam = params.search;
  const isSearch = Boolean(searchParam);
  // Only paginate real searches. The unsearched homepage shows a fixed sample (page 1),
  // so a stray ?pageNo=500 can't walk the whole 142k-row register.
  const pageNo = isSearch ? Math.max(1, Number(params.pageNo) || 1) : 1;

  const allResults = searchParam
  ? fusedCompanies.search(searchParam).map(result => result.item)
  : await loadCompanies();

  // Pagination math
  const totalResults = allResults.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const start = (pageNo - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginationItems = pagination({ currentPage: pageNo, totalPages });

  return (
    <div className="flex min-h-screen flex-col">

      {/* Wordmark header */}
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex w-full max-w-3xl items-end sm:items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
              UK Visa Sponsor Checker
            </h1>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              Official UKVI Register ◆ Live Data
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] opacity-60 sm:text-xs">
              Last Updated: {latestUpdate}
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
        <form method="get" className="mb-8 flex border-2 border-foreground">
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
        <div className="flex items-center justify-between">
          {isSearch ? (
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              ◆ {allResults.length.toLocaleString("en-GB")}{" "}
              {allResults.length === 1 ? "Sponsor" : "Sponsors"} Found
            </p>
          ) : (
            <p className="font-bold uppercase tracking-[0.15em]">
              <span className="text-md sm:text-3xl tabular-nums">
                {allResults.length.toLocaleString("en-GB")}
              </span>{" "}
              <span className="text-xs sm:text-base">Sponsor companies</span>
            </p>
          )}
        </div>
        {/* Before any search */}
        {!searchParam && (
          <p className="sm:my-8 my-4 text-center font-bold uppercase tracking-[0.15em] text-xs sm:text-md opacity-80">
            ◆ Type a company name to check its sponsor status ◆
          </p>
        )}

        {/* No matches */}
        {searchParam && allResults.length === 0 && (
          <div className="mt-8 border-2 border-dashed border-foreground p-8 text-center text-xs uppercase tracking-widest">
            No sponsors found for “{searchParam}”
          </div>
        )}

        {/* Results */}
        {allResults.length > 0 && (
          <div>
            <ul className="space-y-5">
              {allResults.slice(start, end).map(company => {
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
          </div>
        )}

        {/* Pager: only for real searches that span more than one page. */}
        {isSearch && totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2 font-mono text-sm">
            {paginationItems.map((item, i) =>
              item === "..." ? (
                <span key={`gap-${i}`} className="px-2 py-1 opacity-50">…</span>
              ) : item === pageNo ? (
                // current page: not a link
                <span key={item} aria-current="page" className="border-2 border-foreground bg-foreground px-3 py-1 text-background">
                  {item}
                </span>
              ) : (
                <Link key={item} href={pageHref(item, searchParam)} className="border-2 border-foreground px-3 py-1 hover:bg-foreground hover:text-background">
                  {item}
                </Link>
              )
            )}
          </nav>
        )}
      </main>

      <footer className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm uppercase tracking-[0.2em]">
        <span>
          ◆ Data:{" "}
          <a
            href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            gov.uk register of licensed sponsors (workers)
          </a>
        </span>
        <Link href="/about" className="underline underline-offset-2 hover:opacity-80">
          About &amp; FAQ
        </Link>
      </footer>
    </div>
  );
}