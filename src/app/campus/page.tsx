import type { Metadata } from "next";

const UTM =
  "utm_source=campus_qr&utm_medium=offline&utm_campaign=iiitdh_immersion_2_jul2026";

function withUtm(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}${UTM}`;
}

export const metadata: Metadata = {
  title: "IntelliForge × IIIT Dharwad — Pick your door",
  description:
    "Submit a product idea, upskill in AI, or mentor our cohorts. IntelliForge Digital Services at the IIIT Dharwad Campus Immersion Program.",
  openGraph: {
    title: "IntelliForge × IIIT Dharwad",
    description: "Building AI-native products. Pick your door.",
    url: "https://mvplabs.intelliforge.tech/campus",
    type: "website",
  },
};

type Tile = {
  emoji: string;
  title: string;
  blurb: string;
  cta: string;
  href: string;
  accent: "cyan" | "amber";
};

const TILES: Tile[] = [
  {
    emoji: "🚀",
    title: "Have a product idea?",
    blurb:
      "Get free validation from our venture studio. If it's buildable in 4 weeks, we'll tell you how.",
    cta: "Submit your idea",
    href: withUtm("https://mvplabs.intelliforge.tech/submit"),
    accent: "cyan",
  },
  {
    emoji: "📚",
    title: "Want hands-on AI skills?",
    blurb:
      "Practitioner-led, project-first AI upskilling for students and working professionals.",
    cta: "Explore Upskill",
    href: withUtm("https://upskill.intelliforge.tech/"),
    accent: "cyan",
  },
  {
    emoji: "🎓",
    title: "Faculty & researchers — mentor with us",
    blurb:
      "Guide our bootcamp cohorts and product teams. We already collaborate with faculty from KAHER.",
    cta: "Apply as a mentor",
    href: withUtm("https://hrms.intelliforge.tech/mentors"),
    accent: "amber",
  },
];

const ACCENT = {
  cyan: { rule: "bg-[#06b6d4]", button: "bg-[#06b6d4] text-[#04303a]" },
  amber: { rule: "bg-[#f59e0b]", button: "bg-[#f59e0b] text-[#3a2604]" },
} as const;

const WHATSAPP =
  "https://wa.me/917416642072?text=Hi%20Girish%2C%20met%20you%20at%20the%20Campus%20Immersion%20Program";
const LINKEDIN = "https://www.linkedin.com/in/girish-b-hiremath/";

export default function CampusPage() {
  return (
    <div className="campus-root min-h-screen bg-[#faf7f2] text-[#14110d]">
      <div className="mx-auto w-full max-w-[560px] px-5 py-10 sm:py-14">
        <header className="mb-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a7268]">
            IntelliForge Digital Services
          </p>
          <h1 className="campus-heading mt-2 text-[26px] leading-tight font-bold sm:text-[32px]">
            IntelliForge <span className="text-[#06b6d4]">×</span> IIIT Dharwad
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#5c554c]">
            Building AI-native products. Pick your door.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {TILES.map((tile) => (
            <section
              key={tile.href}
              className="overflow-hidden rounded-2xl border border-[#e2dbd0] bg-white shadow-[0_1px_2px_rgba(20,17,13,0.04)]"
            >
              <div className={`h-1 w-full ${ACCENT[tile.accent].rule}`} />
              <div className="p-5">
                <h2 className="campus-heading text-[19px] leading-snug font-bold">
                  <span aria-hidden="true" className="mr-2">
                    {tile.emoji}
                  </span>
                  {tile.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5c554c]">
                  {tile.blurb}
                </p>
                <a
                  href={tile.href}
                  className={`mt-4 flex min-h-[56px] w-full items-center justify-center rounded-xl px-5 text-[16px] font-semibold ${ACCENT[tile.accent].button}`}
                >
                  {tile.cta}
                </a>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-10 border-t border-[#e2dbd0] pt-6">
          <p className="text-[14px] font-medium">Girish Hiremath</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#7a7268]">
            Founder, IntelliForge · M.Tech DS&amp;AI, IIIT Dharwad
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={WHATSAPP}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-[#d8d0c4] px-4 text-[14px] font-medium"
            >
              WhatsApp
            </a>
            <a
              href={LINKEDIN}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-[#d8d0c4] px-4 text-[14px] font-medium"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
