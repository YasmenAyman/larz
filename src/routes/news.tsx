import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News | LARZ Developments" },
      { name: "description", content: "News — LARZ Developments, Egypt." },
      { property: "og:title", content: "News | LARZ Developments" },
      { property: "og:description", content: "News — LARZ Developments, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="News" />,
});
