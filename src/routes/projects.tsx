import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { Masterplan } from "@/components/projects/Masterplan";
import { VirtualTour } from "@/components/projects/VirtualTour";
import { ConstructionUpdates } from "@/components/projects/ConstructionUpdates";
import { Amenities } from "@/components/projects/Amenities";
import { LocationMap } from "@/components/projects/LocationMap";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "KLOVE New Cairo | LARZ Developments Projects" },
      {
        name: "description",
        content:
          "KLOVE — a 24-feddan low-rise green community in New Cairo's Al-Qornofel. Studios to duplexes from 50 to 196 m², with only 20% built area.",
      },
      { property: "og:title", content: "KLOVE New Cairo | LARZ Developments Projects" },
      {
        property: "og:description",
        content:
          "Come home to quiet: a low-rise, green community in New Cairo where 80% of the land stays open.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="min-h-screen bg-night font-sans text-ink">
      <Header />
      <main>
        <ProjectHero />
        <ProjectOverview />
        <Masterplan />
        <VirtualTour />
        <ConstructionUpdates />
        <Amenities />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
