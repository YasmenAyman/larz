import project_img_1 from "@/assets/project_img_1.png";
import project_img_2 from "@/assets/project_img_2.png";
import project_img_3 from "@/assets/project_img_3.png";
import project_img_4 from "@/assets/project_img_4.png";
import gallery_1 from "@/assets/Gallery_1.png";
import gallery_2 from "@/assets/Gallery_2.png";
import gallery_3 from "@/assets/Gallery_3.png";
import gallery_4 from "@/assets/Gallery_4.png";
import gallery_5 from "@/assets/Gallery_5.png";

import user_1 from "@/assets/user_1.png";
import user_2 from "@/assets/user_2.png";

export const ph = (w: number, h: number, label: string) =>
  `https://placehold.co/${w}x${h}/1c1c1c/8a8a8a?text=${encodeURIComponent(label)}`;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About US", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Blogs", to: "/blogs" },
  { label: "Evemts", to: "/events" },
];

export const aboutPolaroids = [
  { src: ph(600, 800, "Lobby"), caption: "" },
  { src: ph(600, 800, "Community"), caption: "Shaping Communities" },
  { src: ph(600, 800, "Tower"), caption: "" },
];

export const stats = [
  { value: "40+", label: "Experience", icon: "award" as const },
  { value: "60+", label: "Projects", icon: "building" as const },
  { value: "15k", label: "Clients", icon: "users" as const },
  { value: "2", label: "Countries", icon: "globe" as const },
];

export const projects = [
  {
    slug: "kov-new-cairo",
    title: "KOV New Cairo",
    location: "Golden Square, New Cairo",
    image: project_img_1,
    status: "Under construction",
    tagline: "Where the Golden Square finally slows down.",
    intro:
      "KOV New Cairo brings retail, offices and clinics into one calm, walkable address in the heart of the Golden Square — designed around daylight, open plazas and easy arrival.",
    facts: [
      { label: "Land area", value: "12 feddans" },
      { label: "Typology", value: "Mixed-use" },
      { label: "Delivery", value: "2027" },
      { label: "Units", value: "180+" },
    ],
    highlights: [
      "Double-height retail frontage along the main spine",
      "Panoramic office floors with private terraces",
      "Three levels of covered parking with direct lift access",
      "Landscaped plaza with water features and shaded seating",
    ],
    gallery: [gallery_1, gallery_2, gallery_3],
  },
  {
    slug: "larz-business-hub",
    title: "LARZ Business Hub",
    location: "New Cairo",
    image: project_img_2,
    status: "Now selling",
    tagline: "A workplace that behaves like a neighbourhood.",
    intro:
      "Flexible office floors, ground-level cafés and a courtyard that keeps the working day human — built for companies that want presence without noise.",
    facts: [
      { label: "Land area", value: "8 feddans" },
      { label: "Typology", value: "Offices & retail" },
      { label: "Delivery", value: "2026" },
      { label: "Units", value: "120+" },
    ],
    highlights: [
      "Column-free floor plates from 60 to 400 m²",
      "Central courtyard with all-day shade",
      "Dedicated visitor drop-off and valet",
      "Smart access and building management systems",
    ],
    gallery: [gallery_2, gallery_4, gallery_5],
  },
  {
    slug: "larz-medical-park",
    title: "LARZ Medical Park",
    location: "New Cairo",
    image: project_img_3,
    status: "Now selling",
    tagline: "Care, planned around calm.",
    intro:
      "A clinics-and-labs destination with quiet waiting areas, generous circulation and parking that never becomes part of the appointment.",
    facts: [
      { label: "Land area", value: "6 feddans" },
      { label: "Typology", value: "Medical" },
      { label: "Delivery", value: "2027" },
      { label: "Units", value: "90+" },
    ],
    highlights: [
      "Clinic units from 45 m² with flexible fit-out",
      "Separate patient and staff circulation",
      "Pharmacy and diagnostics on the ground floor",
      "Naturally lit waiting lounges",
    ],
    gallery: [gallery_3, gallery_1, gallery_5],
  },
  {
    slug: "larz-riverside",
    title: "LARZ Riverside",
    location: "New Cairo",
    image: project_img_4,
    status: "Coming soon",
    tagline: "Living close to water, and to everything.",
    intro:
      "Low-rise residences arranged around lakes and open green, with terraces that face the landscape instead of the street.",
    facts: [
      { label: "Land area", value: "18 feddans" },
      { label: "Typology", value: "Residential" },
      { label: "Delivery", value: "2028" },
      { label: "Units", value: "240+" },
    ],
    highlights: [
      "Apartments, duplexes and garden homes",
      "Only 22% of the land built on",
      "Lakeside walking and cycling loop",
      "Clubhouse, pools and family lawns",
    ],
    gallery: [gallery_4, gallery_5, gallery_2],
  },
];


export const gallery = [
  gallery_1,
  gallery_2,
  gallery_3,
  gallery_4,
  gallery_5,
];

export const testimonials = [
  {
    quote:
      '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."',
    name: "Ahmed K.",
    role: "Business Owner",
    image: user_2,
  },
  {
    quote:
      '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."',
    name: "Muhammed Y.",
    role: "Homeowner",
    image: user_1,
  },
  {
    quote:
      '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."',
    name: "Ahmed K.",
    role: "Business Owner",
    image: user_2,
  },
  {
    quote:
      '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."',
    name: "Muhammed Y.",
    role: "Homeowner",
    image: user_1,
  },
];

export const contact = {
  address: "Kov mall, Beside Mivida gate 6, New Cairo 1, End of Road 90 Next to AUC N...",
  email: "info@larzdevelopments.com",
  phone: "15813",
};

export const footerMenu = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "News", to: "/news" },
];
