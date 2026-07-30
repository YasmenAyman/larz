import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function PageStub({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-[1440px] items-center px-4 pt-44 pb-24 sm:px-8">
        <h1 className="text-4xl font-light text-ink sm:text-5xl">{title}</h1>
      </main>
      <Footer />
    </div>
  );
}
