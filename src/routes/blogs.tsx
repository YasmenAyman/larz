import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Blogs | LARZ Developments" },
      { name: "description", content: "Blogs — LARZ Developments, Egypt." },
      { property: "og:title", content: "Blogs | LARZ Developments" },
      { property: "og:description", content: "Blogs — LARZ Developments, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="Blogs" />,
});
