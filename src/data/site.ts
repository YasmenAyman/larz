import project_img_1 from "@/assets/project_img_1.png";
import project_img_2 from "@/assets/project_img_2.png";
import project_img_3 from "@/assets/project_img_3.png";
import project_img_4 from "@/assets/project_img_4.png";
import gallery_1 from "@/assets/Gallery_1.png";
import gallery_2 from "@/assets/Gallery_2.png";
import gallery_3 from "@/assets/Gallery_3.png";
import gallery_4 from "@/assets/Gallery_4.png";
import gallery_5 from "@/assets/Gallery_5.png";

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
    title: "KOV New Cairo",
    location: "Golden Square, New Cairo",
    image: project_img_1,
  },
  { title: "LARZ Business Hub", location: "New Cairo", image:  project_img_2,},
  { title: "LARZ Business Hub", location: "New Cairo", image:  project_img_3,},
  { title: "LARZ Business Hub", location: "New Cairo", image:  project_img_4,},
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
