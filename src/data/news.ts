import project_img_1 from "@/assets/project_img_1.png";
import project_img_2 from "@/assets/project_img_2.png";
import project_img_3 from "@/assets/project_img_3.png";
import project_img_4 from "@/assets/project_img_4.png";
import hero_image_1 from "@/assets/hero-image-1.png";
import hero_image_2 from "@/assets/hero-image-2.png";
import tower_img from "@/assets/tower_img.png";
import gallery_1 from "@/assets/Gallery_1.png";
import gallery_2 from "@/assets/Gallery_2.png";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  topic: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  isFeatured?: boolean;
  relatedJobSlug?: string;
  relatedJobTitle?: string;
}

export const newsCategories = [
  "All Categories",
  "Company Updates",
  "Architecture & Design",
  "Sustainability",
  "Careers & Culture",
];

export const newsTopics = [
  "All Topics",
  "Innovation",
  "Real Estate",
  "Sponsorships",
  "Open Positions",
];

export const featuredNewsList: NewsArticle[] = [
  {
    id: "feat-1",
    slug: "designing-the-future-of-modern-living",
    title: "Designing the Future of Modern Living",
    category: "Architecture & Design",
    topic: "Innovation",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_1,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "At LARZ Developments, we believe architectural excellence begins with understanding how communities live, work, and thrive. Our latest developments integrate smart technology, passive climate controls, and fluid open spaces to create environments that stand the test of time.",
    relatedJobSlug: "senior-architect",
    relatedJobTitle: "Senior Architect",
  },
  {
    id: "feat-2",
    slug: "designing-the-future-of-modern-living-2",
    title: "Designing the Future of Modern Living",
    category: "Company Updates",
    topic: "Real Estate",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_2,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "Modern development requires a synthesis of structural engineering precision and aesthetic harmony. Explore how LARZ is setting new benchmarks across Cairo's prime addresses.",
    relatedJobSlug: "project-engineer",
    relatedJobTitle: "Project Engineer",
  },
];

export const mainVideoNews: NewsArticle = {
  id: "video-news-1",
  slug: "football-access-summit-2025-platinum-sponsor",
  title:
    "LARZ Developments is a proud Platinum Sponsor of the Football Access Summit 2025,supporting init iatives that make football more inclusive and accessible for all",
  category: "Company Updates",
  topic: "Sponsorships",
  date: "January 20, 2026",
  readTime: "4 Min read",
  image: hero_image_1,
  excerpt:
    "LARZ Developments: Championing Innovation at the Football Access Summit 2025 LARZ Developments, a leader in real estate innovation, proudly takes center stage as a Platinum Sponsor at the Football Access Summit 2025. This prestigious event, dedicated to advancing inclusivity, accessibility,",
  content:
    "LARZ Developments: Championing Innovation at the Football Access Summit 2025. LARZ Developments, a leader in real estate innovation, proudly takes center stage as a Platinum Sponsor at the Football Access Summit 2025. This prestigious event, dedicated to advancing inclusivity, accessibility, and community engagement through sports, aligns perfectly with LARZ's vision of building vibrant, inclusive communities across Egypt.",
  relatedJobSlug: "sales-consultant",
  relatedJobTitle: "Sales Consultant",
};

export const articlesList: NewsArticle[] = [
  {
    id: "art-1",
    slug: "designing-the-future-of-modern-living-art-1",
    title: "Designing the Future of Modern Living",
    category: "Architecture & Design",
    topic: "Innovation",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_1,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "Our architectural philosophy centers around timeless aesthetics and biophilic design. Every project is crafted to maximize natural daylight and ventilation while seamlessly connecting indoor spaces with green landscapes.",
    relatedJobSlug: "senior-architect",
    relatedJobTitle: "Senior Architect",
  },
  {
    id: "art-2",
    slug: "designing-the-future-of-modern-living-art-2",
    title: "Designing the Future of Modern Living",
    category: "Sustainability",
    topic: "Real Estate",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_2,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "Sustainable urban development is no longer optional — it is the bedrock of modern real estate. Discover our energy-efficient building facades and water management strategies.",
    relatedJobSlug: "project-engineer",
    relatedJobTitle: "Project Engineer",
  },
  {
    id: "art-3",
    slug: "designing-the-future-of-modern-living-art-3",
    title: "Designing the Future of Modern Living",
    category: "Careers & Culture",
    topic: "Open Positions",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_3,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "At LARZ, we nurture talent and encourage interdisciplinary collaboration. Learn about our work culture, career growth opportunities, and open roles in Cairo.",
    relatedJobSlug: "interior-designer",
    relatedJobTitle: "Interior Designer",
  },
  {
    id: "art-4",
    slug: "designing-the-future-of-modern-living-art-4",
    title: "Designing the Future of Modern Living",
    category: "Company Updates",
    topic: "Real Estate",
    date: "January 25, 2026",
    readTime: "5 Min read",
    image: project_img_4,
    excerpt:
      "Discover how thoughtful architecture, innovative planning, and sustainable design are shaping exceptional communities for generations to come.",
    content:
      "As LARZ continues to expand its portfolio in New Cairo and beyond, we remain committed to delivers spaces that blend functionality, elegance, and high investment return.",
    relatedJobSlug: "sales-consultant",
    relatedJobTitle: "Sales Consultant",
  },
  {
    id: "art-5",
    slug: "shaping-the-skyline-of-new-cairo",
    title: "Shaping the Skyline of New Cairo",
    category: "Architecture & Design",
    topic: "Innovation",
    date: "January 18, 2026",
    readTime: "6 Min read",
    image: tower_img,
    excerpt:
      "An in-depth look at our flagship mixed-use towers combining luxury offices, medical suites, and boutique retail plazas.",
    content:
      "New Cairo is evolving into a global business hub. Our architectural team details the master planning behind KOV New Cairo and LARZ Business Hub.",
    relatedJobSlug: "senior-architect",
    relatedJobTitle: "Senior Architect",
  },
  {
    id: "art-6",
    slug: "crafting-interior-experiences",
    title: "Crafting Interior Experiences that Inspire",
    category: "Careers & Culture",
    topic: "Open Positions",
    date: "January 12, 2026",
    readTime: "4 Min read",
    image: gallery_1,
    excerpt:
      "How LARZ interior design teams curate materials, lighting, and textures to evoke calm and elegance.",
    content:
      "Interior design is the soul of any space. Explore how our interior design department elevates residential lobbies and executive office suites.",
    relatedJobSlug: "interior-designer",
    relatedJobTitle: "Interior Designer",
  },
];
