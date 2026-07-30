import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/layout/PageStub";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | LARZ Developments" },
      { name: "description", content: "Contact — LARZ Developments, Egypt." },
      { property: "og:title", content: "Contact | LARZ Developments" },
      { property: "og:description", content: "Contact — LARZ Developments, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageStub title="Contact" />,
});
