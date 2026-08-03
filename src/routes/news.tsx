import { createFileRoute } from "@tanstack/react-router";
import { NewsPage } from "@/components/news/NewsPage";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Insights & News | LARZ Developments" },
      { name: "description", content: "Stay informed with the latest company updates, project milestones, industry insights, and stories shaping the future of modern development." },
      { property: "og:title", content: "Insights & News | LARZ Developments" },
      { property: "og:description", content: "Stay informed with the latest company updates, project milestones, industry insights, and stories shaping the future of modern development." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});
