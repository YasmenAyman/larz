export const ph = (w: number, h: number, label: string) =>
  `https://placehold.co/${w}x${h}/1c1c1c/8a8a8a?text=${encodeURIComponent(label)}`;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About US", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Blogs", to: "/blogs" },
  { label: "Evemts", to: "/events" },
];

export const heroCards = [
  ph(400, 400, "KOV"),
  ph(400, 400, "Facade"),
  ph(400, 400, "Interior"),
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
    title: "KOV New Cairo",
    location: "Golden Square, New Cairo",
    image: ph(900, 1000, "KOV New Cairo"),
  },
  { title: "LARZ Business Hub", location: "New Cairo", image: ph(500, 1000, "LARZ Business Hub") },
  { title: "LARZ Business Hub", location: "New Cairo", image: ph(500, 1000, "LARZ Business Hub") },
  { title: "LARZ Business Hub", location: "New Cairo", image: ph(500, 1000, "LARZ Business Hub") },
];

export const gallery = [
  ph(600, 700, "Gallery 1"),
  ph(600, 700, "Gallery 2"),
  ph(600, 700, "Gallery 3"),
  ph(600, 700, "Gallery 4"),
  ph(600, 700, "Gallery 5"),
];

export const testimonials = [
  {
    quote:
      '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."',
    name: "Ahmed K.",
    role: "Business Owner",
    image: ph(400, 500, "Ahmed K."),
  },
  {
    quote:
      '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."',
    name: "Muhammed Y.",
    role: "Homeowner",
    image: ph(400, 500, "Muhammed Y."),
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
