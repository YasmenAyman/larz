import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | LARZ Developments" },
      {
        name: "description",
        content:
          "Learn about LARZ Developments, an Egyptian developer of innovative residential and commercial spaces.",
      },
      { property: "og:title", content: "About Us | LARZ Developments" },
      {
        property: "og:description",
        content: "Building more than buildings, we build lasting value.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="About US" />,
});
