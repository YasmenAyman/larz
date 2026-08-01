import { Facebook, Instagram, Linkedin } from "lucide-react";
import { PillButton } from "@/components/shared/PillButton";
// import { heroCards, ph } from "@/data/site";
import heroImage1 from "@/assets/hero-image-1.png";
import heroImage2 from "@/assets/hero-image-2.png";
import heroImage3 from "@/assets/hero-image-3.png";
import tower_img from "@/assets/tower_img.png"


const heroCards = [
  heroImage1,
  heroImage2,
  heroImage3,
];
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface pt-36 pb-16 sm:pt-40 lg:pt-44 lg:pb-2">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 text-[22vw] leading-none font-light tracking-[0.12em] text-ink/[0.05] select-none"
      >
        LARZ
      </span>

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl leading-[1.15] font-light text-ink sm:text-5xl lg:text-[3.4rem]">
            Designed for
            <br />
            the Way You Live
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">
            Discover thoughtfully designed communities that combine architectural excellence,
            lasting value, and a lifestyle built around comfort and elegance.
          </p>

          <div className="mt-10 flex items-center">
            {heroCards.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="LARZ project preview"
                className="size-32 rounded-2xl border border-hairline/60 object-cover sm:size-36"
                style={{
                  marginLeft: i === 0 ? 0 : "-1.75rem",
                  transform: `rotate(${(i - 1) * 4}deg)`,
                }}
              />
            ))}
          </div>

          <PillButton label="Our Project's" to="/projects" variant="split" className="mt-10" />
        </div>

        <div className="relative">
          <img
            src={tower_img}
            alt="LARZ tower exterior"
            className="ml-auto aspect-square w-full max-w-[620px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
