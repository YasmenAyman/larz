import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | LARZ Developments" },
      { name: "description", content: "Projects — LARZ Developments, Egypt." },
      { property: "og:title", content: "Projects | LARZ Developments" },
      { property: "og:description", content: "Projects — LARZ Developments, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="Projects" />,
});
