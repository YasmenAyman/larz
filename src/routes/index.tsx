import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LARZ Developments | Designed for the Way You Live" },
      {
        name: "description",
        content:
          "LARZ Developments builds thoughtfully designed residential and commercial communities in Egypt, combining architectural excellence and lasting value.",
      },
      { property: "og:title", content: "LARZ Developments | Designed for the Way You Live" },
      {
        property: "og:description",
        content:
          "Discover thoughtfully designed communities that combine architectural excellence, lasting value, and a lifestyle built around comfort and elegance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Header />
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
