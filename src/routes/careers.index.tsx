import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CareersHero,
  WhyJoinLarz,
  OpenPositions,
} from "@/components/careers/CareersSections";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers at LARZ Developments | Shape the Future With Us" },
      {
        name: "description",
        content:
          "Explore careers at LARZ Developments across architecture, engineering, design, and corporate teams in Cairo, Egypt.",
      },
      { property: "og:title", content: "Careers at LARZ Developments" },
      {
        property: "og:description",
        content:
          "Join a team where innovation, collaboration, and craftsmanship create exceptional developments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Header />
      <main>
        <CareersHero />
        <WhyJoinLarz />
        <OpenPositions />
      </main>
      <Footer />
    </div>
  );
}
