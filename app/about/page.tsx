import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "What the UK Visa Sponsor Checker does and how international students and skilled workers can use it to find companies that hold a UK Worker sponsor licence.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${SITE_NAME}`,
    description:
      "How international students and skilled workers can use the UK Visa Sponsor Checker to find licensed visa sponsors.",
    url: "/about",
    type: "article",
  },
};

// Single source of truth: the visible FAQ and the FAQPage JSON-LD are rendered
// from this one array so they can never drift apart.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is a UK sponsor licence?",
    a: "A sponsor licence is permission granted by UK Visas and Immigration (UKVI) that allows an organisation to employ people from outside the UK on work visas such as the Skilled Worker route. If a company does not hold a licence, it cannot sponsor you, no matter how much it wants to hire you.",
  },
  {
    q: "How do I know if a company can sponsor my visa?",
    a: "Search for the company name on the home page. If it appears, it currently holds a Worker sponsor licence on the official gov.uk register and is, in principle, able to sponsor eligible roles. If it does not appear, it is not a licensed Worker sponsor at the time the data was last published.",
  },
  {
    q: "What is the difference between an A rating and a B rating?",
    a: "An A rating is the standard, fully compliant licence status. A B rating is a temporary, downgraded status given when UKVI has compliance concerns; the sponsor is on an action plan to get back to an A rating and faces restrictions in the meantime. Most employers you search for will be A-rated.",
  },
  {
    q: "I'm an international student — how does this help me?",
    a: "When you are job hunting on the Graduate route or looking ahead to a Skilled Worker visa, you can waste a lot of time applying to employers that are not able to sponsor you. Checking a company here first lets you focus your applications on organisations that already hold a licence and can realistically support a future visa.",
  },
  {
    q: "Does appearing on the register guarantee a job offer or sponsorship?",
    a: "No. The register only shows that a company is permitted to sponsor workers. Whether it will sponsor a particular role depends on the job, the salary, the specific visa route, and the employer's own decision. Always confirm sponsorship directly with the employer.",
  },
  {
    q: "How often is the data updated?",
    a: "The data comes from the official gov.uk register of licensed sponsors, which the Home Office publishes regularly. We refresh from that source and show the date of the data we are currently serving on the home page.",
  },
];

// One label/value row, matching the brutalist table on the home page.
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[160px_1fr] border-b-2 border-foreground last:border-b-0">
      <dt className="border-r-2 border-foreground px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        {label}
      </dt>
      <dd className="px-3 py-2 text-xs sm:text-sm">{children}</dd>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 mb-3 text-lg font-bold uppercase tracking-tight sm:text-xl">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  // FAQPage structured data → eligible for FAQ rich results in Google.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* JSON-LD is intentionally injected as a raw script tag for crawlers. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Wordmark header */}
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex w-full max-w-3xl items-end justify-between px-4 py-4">
          <div>
            <Link href="/" className="hover:opacity-80">
              <span className="text-2xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              About this tool
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 border-2 border-foreground px-3 py-1 text-xs font-bold uppercase transition-opacity hover:opacity-80"
          >
            ← Search
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
          Find UK companies that can sponsor your visa
        </h1>

        <p className="mt-5 text-sm leading-relaxed sm:text-base">
          The {SITE_NAME} is a free, fast way to check whether a UK company holds a
          Worker sponsor licence — the official permission an employer needs before it
          can hire someone on a work visa such as the Skilled Worker route. It is built
          for <strong>international university students</strong>, graduates, and skilled
          workers who want to spend their job-hunting time on employers that can actually
          support a UK visa.
        </p>

        <H2>Who this is for</H2>
        <p className="text-sm leading-relaxed sm:text-base">
          If you are an international student finishing your degree, on the Graduate
          (post-study) route, or applying for jobs from overseas, sponsorship is often the
          single biggest factor in whether an application can go anywhere. Many great roles
          are advertised by companies that simply are not licensed to sponsor — so applying
          to them is a dead end. This tool lets you check first and target your effort.
        </p>

        <H2>How to use it</H2>
        <ol className="space-y-3 text-sm leading-relaxed sm:text-base">
          <li>
            <strong>1.</strong> Go to the{" "}
            <Link href="/" className="underline underline-offset-4 hover:opacity-80">
              search page
            </Link>{" "}
            and type a company name.
          </li>
          <li>
            <strong>2.</strong> Browse the matches. Each result shows the company, its
            location, its licence type and rating, and the visa routes it can sponsor.
          </li>
          <li>
            <strong>3.</strong> If a company appears, it is a licensed Worker sponsor. If it
            does not, it is not on the register for the period of our latest data.
          </li>
        </ol>

        <H2>Understanding a result</H2>
        <dl className="border-2 border-foreground">
          <Row label="Rating A">
            Standard, fully compliant sponsor licence.
          </Row>
          <Row label="Rating B">
            Temporary downgraded status while the sponsor works through a UKVI action plan.
          </Row>
          <Row label="Routes">
            The visa categories the company is licensed to sponsor (e.g. Skilled Worker).
          </Row>
          <Row label="Location">
            The town/city and county UKVI holds for the sponsor.
          </Row>
        </dl>

        <H2>Where the data comes from</H2>
        <p className="text-sm leading-relaxed sm:text-base">
          Every result is sourced from the official{" "}
          <a
            href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
          >
            gov.uk register of licensed sponsors (workers)
          </a>
          , published by the Home Office. We do not add or remove companies — we just make
          the register quicker to search. The date of the data we are currently serving is
          shown on the search page.
        </p>

        <H2>Important — please read</H2>
        <p className="text-sm leading-relaxed sm:text-base">
          This site is an unofficial convenience tool and{" "}
          <strong>not legal or immigration advice</strong>. Being on the register means a
          company <em>can</em> sponsor workers — it does not mean it will sponsor any
          particular role or applicant. Licences can change between updates. Always confirm
          sponsorship directly with the employer and check the latest official guidance on
          gov.uk before making decisions.
        </p>

        <H2>Frequently asked questions</H2>
        <dl className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-sm font-bold uppercase tracking-wide sm:text-base">
                {q}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed sm:text-base">{a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 border-2 border-foreground p-5 text-center">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-80"
          >
            Check a company now →
          </Link>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-4 text-sm uppercase tracking-[0.2em]">
        ◆ Data:{" "}
        <a
          href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          gov.uk register of licensed sponsors (workers)
        </a>
      </footer>
    </div>
  );
}
