import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronDown,
  Search,
  Play,
  X,
  Sparkles,
  Briefcase,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  featuredNewsList,
  mainVideoNews,
  articlesList,
  newsCategories,
  newsTopics,
  type NewsArticle,
} from "@/data/news";
import { openPositions } from "@/data/careers";

export function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Active article modal state
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  // Video player modal state
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articlesList.filter((art) => {
      const matchCat =
        selectedCategory === "All Categories" || art.category === selectedCategory;
      const matchTopic =
        selectedTopic === "All Topics" || art.topic === selectedTopic;
      const matchQuery =
        searchQuery.trim() === "" ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchTopic && matchQuery;
    });
  }, [selectedCategory, selectedTopic, searchQuery]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased">
      <Header />

      <main className="relative pt-32 sm:pt-40">
        {/* Top Watermark Background */}
        <section className="relative overflow-hidden bg-black pb-16 pt-6">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none text-[32vw] font-light leading-none tracking-[0.14em] text-white/[0.03] z-0"
          >
            LARZ
          </span>

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8">
            {/* Page Header Title */}
            <div className="text-center">
              <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
                Insights & News
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
                Stay informed with the latest company updates, project milestones, industry insights, and stories shaping the future of modern development.
              </p>
            </div>

            {/* Top 2 Featured Cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {featuredNewsList.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveArticle(card)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 transition-all duration-300 hover:border-white/20"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Glassmorphic overlay card at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-between rounded-2xl border border-white/15 bg-black/60 p-5 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-6 transition-all duration-300 group-hover:bg-black/75 group-hover:border-white/30">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-300">
                          <span>{card.date}</span>
                          <span>•</span>
                          <span>{card.readTime}</span>
                        </div>

                        <h2 className="mt-2 text-lg font-medium leading-snug text-white sm:text-xl md:text-2xl group-hover:text-amber-200/90 transition-colors">
                          {card.title}
                        </h2>

                        <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400 sm:text-sm line-clamp-2">
                          {card.excerpt}
                        </p>
                      </div>

                      {/* Arrow Icon Button */}
                      <div className="mt-4 flex justify-end">
                        <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black">
                          <ArrowUpRight className="size-4" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="relative border-t border-white/10 bg-black py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            {/* Header with Sparkle Icon */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-white/5 text-white border border-white/10">
                  <Sparkles className="size-5 text-amber-200/90" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  Latest News
                </h2>
              </div>
              <p className="text-sm font-light text-neutral-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            {/* Video Hero Thumbnail Container */}
            <div className="relative mt-8 aspect-[16/8] min-h-[300px] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 sm:min-h-[420px]">
              <img
                src={mainVideoNews.image}
                alt={mainVideoNews.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 grid place-items-center">
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  aria-label="Play video"
                  className="group grid size-16 sm:size-20 place-items-center rounded-full border border-white/30 bg-teal-900/50 text-white backdrop-blur-md shadow-2xl transition-transform duration-300 hover:scale-110 hover:bg-teal-800/80 cursor-pointer"
                >
                  <Play className="size-7 fill-white text-white translate-x-0.5 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Video Post Description */}
            <div className="mt-8">
              <h3 className="text-xl font-medium leading-snug text-white sm:text-2xl md:text-3xl">
                {mainVideoNews.title}
              </h3>
              <p className="mt-4 max-w-5xl text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
                {mainVideoNews.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveArticle(mainVideoNews)}
                  className="rounded-full border border-neutral-700 bg-neutral-900/90 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 hover:border-neutral-500"
                >
                  Read More
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(mainVideoNews)}
                  aria-label="Read more details"
                  className="grid size-11 place-items-center rounded-full border border-neutral-700 bg-neutral-900/90 text-white transition-colors hover:bg-neutral-800 hover:border-neutral-500"
                >
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Our Latest Articles Section */}
        <section className="relative bg-black py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            {/* Header Row */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Explore Our
                  <br />
                  Latest Articles
                </h2>
              </div>
              <p className="max-w-md text-sm font-light leading-relaxed text-neutral-400">
                Browse expert insights, project stories, industry trends, and company updates that reflect our commitment to innovation, quality, and exceptional design.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              {/* Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none rounded-full border border-white/10 bg-neutral-900/80 py-2.5 pl-5 pr-10 text-sm font-light text-neutral-200 transition-colors focus:border-white/30 focus:outline-none cursor-pointer"
                  >
                    {newsCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                </div>

                {/* Topic Dropdown */}
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => {
                      setSelectedTopic(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none rounded-full border border-white/10 bg-neutral-900/80 py-2.5 pl-5 pr-10 text-sm font-light text-neutral-200 transition-colors focus:border-white/30 focus:outline-none cursor-pointer"
                  >
                    {newsTopics.map((top) => (
                      <option key={top} value={top} className="bg-neutral-900 text-white">
                        {top}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none rounded-full border border-white/10 bg-neutral-900/80 py-2.5 pl-5 pr-10 text-sm font-light text-neutral-200 transition-colors focus:border-white/30 focus:outline-none cursor-pointer"
                  >
                    <option value="Newest First" className="bg-neutral-900 text-white">
                      Newest First
                    </option>
                    <option value="Oldest First" className="bg-neutral-900 text-white">
                      Oldest First
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Search Bar Input */}
              <div className="relative w-full max-w-xs sm:w-auto">
                <input
                  type="text"
                  placeholder="Search Articles...."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-full border border-white/10 bg-neutral-900/80 py-2.5 pl-5 pr-11 text-sm font-light text-white placeholder:text-neutral-500 transition-colors focus:border-white/30 focus:outline-none"
                />
                <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            {/* 2x2 Article Cards Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {currentArticles.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveArticle(card)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 transition-all duration-300 hover:border-white/20"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Frosted Glass overlay card */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-between rounded-2xl border border-white/15 bg-black/60 p-5 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-6 transition-all duration-300 group-hover:bg-black/75 group-hover:border-white/30">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-300">
                          <span>{card.date}</span>
                          <span>•</span>
                          <span>{card.readTime}</span>
                        </div>

                        <h3 className="mt-2 text-lg font-medium leading-snug text-white sm:text-xl md:text-2xl group-hover:text-amber-200/90 transition-colors">
                          {card.title}
                        </h3>

                        <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400 sm:text-sm line-clamp-2">
                          {card.excerpt}
                        </p>
                      </div>

                      {/* Bottom-right arrow button */}
                      <div className="mt-4 flex justify-end">
                        <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black">
                          <ArrowUpRight className="size-4" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/80 px-4 py-2 text-xs font-light text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft className="size-3.5" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`grid size-9 place-items-center rounded-lg text-xs font-medium transition-all ${
                      currentPage === pg
                        ? "bg-amber-100 text-black font-semibold shadow-md"
                        : "border border-white/10 bg-neutral-900/80 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/80 px-4 py-2 text-xs font-light text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>
        
      </main>

      {/* Article Detail Modal (With Job Interlinking) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/20 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 text-xs text-amber-200/90">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {activeArticle.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {activeArticle.readTime}
              </span>
              <span>•</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-neutral-300">
                {activeArticle.category}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-medium leading-snug sm:text-3xl">
              {activeArticle.title}
            </h2>

            <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="mt-6 text-sm sm:text-base leading-relaxed font-light text-neutral-300 whitespace-pre-line">
              {activeArticle.content}
            </p>

            {/* Interlinked Job Position Callout */}
            {activeArticle.relatedJobSlug && (
              <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                      Career Opportunity
                    </span>
                    <p className="mt-1 text-base font-medium text-white">
                      Are you passionate about this domain? We are hiring a{" "}
                      <span className="text-amber-200 underline">
                        {activeArticle.relatedJobTitle || "Team Member"}
                      </span>
                    </p>
                  </div>
                  <Link
                    to="/careers/$slug"
                    params={{ slug: activeArticle.relatedJobSlug }}
                    onClick={() => setActiveArticle(null)}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2.5 text-xs font-semibold text-black hover:bg-white transition-colors shrink-0"
                  >
                    View Job & Apply
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-black border border-white/20">
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="size-5" />
            </button>
            <div className="relative aspect-[16/9] w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Football Access Summit 2025"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
