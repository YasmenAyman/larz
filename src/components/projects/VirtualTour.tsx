import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, X } from "lucide-react";
import { Eyebrow } from "@/components/projects/Eyebrow";
import { homeTypes } from "@/data/project";

export function VirtualTour() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      {/* ── Virtual Tour Section ── */}
      <section
        className="relative border-b border-hairline/30 py-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #2a2210 0%, #16130a 50%, #0a0905 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          {/* Play button */}
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label="Play virtual tour video"
            className="mx-auto grid size-11 place-items-center rounded-full border border-gold text-gold transition-all duration-300 hover:bg-gold/10 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Play className="size-4 translate-x-[1px]" strokeWidth={1.5} />
          </button>

          <Eyebrow className="mt-6 justify-center">Virtual tour</Eyebrow>
          <h2 className="mt-5 text-3xl leading-[1.2] font-light text-ink sm:text-[2.1rem]">
            Take a walk through <span className="text-ink">Klove</span> tonight.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            From your sofa — the streets, the landscape and the spaces, before you ever visit.
          </p>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10"
          >
            Start the virtual tour
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* ── Video Modal ── */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              aria-label="Close video"
              className="absolute -top-10 right-0 flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-xs tracking-[0.15em] uppercase"
            >
              Close <X className="size-3.5" strokeWidth={1.5} />
            </button>

            {/* Video iframe */}
            <div className="relative w-full aspect-video border border-hairline/30">
              <iframe
                src="https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX"
                title="KLOVE New Cairo — Virtual Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
              {/* <iframe src="https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
            </div>
          </div>
        </div>
      )}

      {/* ── 3D Homes Section ── */}
      <section className="bg-night py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Eyebrow>The homes · in 3D</Eyebrow>
          <h2 className="mt-6 text-3xl leading-[1.2] font-light text-ink sm:text-[2.25rem]">
            A home that fits where you are in life.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
            Eight ways to live at Klove — explore each one in three dimensions, room by room.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeTypes.map((home) => (
              <Link
                key={home.tag}
                to="/projects/$slug"
                params={{ slug: home.slug }}
                className="block border border-hairline/40 bg-surface-card/40 p-5 transition-colors hover:border-gold/50"
              >
                <p className="text-[0.6rem] tracking-[0.22em] text-ink uppercase">{home.tag}</p>
                <h3 className="mt-3 text-base font-light text-ink">{home.name}</h3>
                <p className="mt-3 text-2xl font-light text-ink">
                  {home.size}
                  <span className="ml-1 align-super text-[0.6rem] text-ink-dim">m²</span>
                </p>
                <p className="mt-5 flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-ink-muted uppercase">
                  View in 3D <ArrowRight className="size-3" strokeWidth={1.5} />
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-10 flex items-center gap-3 text-xs text-ink">
            <span className="inline-block h-px w-6 bg-gold" />
            Every home opens onto its own private terrace.
          </p>
        </div>
      </section>
    </>
  );
}
