import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | LARZ Developments" },
      { name: "description", content: "Events — LARZ Developments, Egypt." },
      { property: "og:title", content: "Events | LARZ Developments" },
      { property: "og:description", content: "Events — LARZ Developments, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="Events" />,
});
