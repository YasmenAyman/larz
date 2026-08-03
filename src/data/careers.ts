export const careerValues = [
  {
    icon: "growth" as const,
    title: "Career Growth",
    text: "Empowering your professional journey through learning, mentorship, and advancement.",
  },
  {
    icon: "innovation" as const,
    title: "Innovation",
    text: "Transforming ambitious ideas into exceptional architectural experiences.",
  },
  {
    icon: "collaboration" as const,
    title: "Collaboration",
    text: "Building success together through teamwork, creativity, and mutual respect.",
  },
];

export type Position = {
  slug: string;
  title: string;
  type: string;
  department: string;
  description: string;
  location: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
};

export const openPositions: Position[] = [
  {
    slug: "senior-architect",
    title: "Senior Architect",
    type: "Full Time",
    department: "Architecture",
    description: "Lead high-end architectural projects from concept to completion.",
    location: "Cairo, Egypt",
    intro:
      "We are looking for an experienced Senior Architect to lead the design and delivery of high-end residential and commercial developments. You will collaborate with multidisciplinary teams to create innovative, functional, and sustainable spaces that reflect LARZ's commitment to quality and excellence.",
    responsibilities: [
      "Lead architectural projects from concept to completion.",
      "Develop innovative and functional design solutions.",
      "Prepare and review architectural drawings and documentation.",
      "Coordinate with engineers, consultants, and project teams.",
      "Ensure compliance with building codes and quality standards.",
      "Manage project timelines, budgets, and design deliverables.",
      "Present design concepts to clients and stakeholders.",
      "Mentor junior architects and support team development.",
    ],
    requirements: [
      "Bachelor's degree in Architecture.",
      "5+ years of professional architectural experience.",
      "Proficiency in AutoCAD, Revit, and SketchUp.",
      "Strong knowledge of building codes and regulations.",
      "Excellent design, problem-solving, and communication skills.",
      "Experience coordinating multidisciplinary teams.",
      "Strong portfolio showcasing residential and commercial projects.",
      "Ability to manage multiple projects and meet deadlines.",
    ],
  },
  {
    slug: "project-engineer",
    title: "Project Engineer",
    type: "Full Time",
    department: "Engineering",
    description: "Lead high-end architectural projects from concept to completion.",
    location: "Cairo, Egypt",
    intro:
      "We are looking for a Project Engineer to oversee the technical delivery of our developments. You will coordinate site execution, quality, and schedules across multidisciplinary teams to uphold LARZ's standards of excellence.",
    responsibilities: [
      "Coordinate day-to-day site execution and technical delivery.",
      "Review shop drawings and technical submittals.",
      "Track project schedules, budgets, and progress reports.",
      "Liaise with consultants, contractors, and suppliers.",
      "Ensure compliance with safety and quality standards.",
      "Support handover documentation and closeout.",
    ],
    requirements: [
      "Bachelor's degree in Civil or Construction Engineering.",
      "4+ years of experience in real estate development projects.",
      "Strong knowledge of construction methods and standards.",
      "Proficiency in Primavera or MS Project.",
      "Excellent coordination and reporting skills.",
      "Ability to manage multiple stakeholders on site.",
    ],
  },
  {
    slug: "interior-designer",
    title: "Interior Designer",
    type: "Full Time",
    department: "Design",
    description: "Lead high-end architectural projects from concept to completion.",
    location: "Cairo, Egypt",
    intro:
      "We are looking for an Interior Designer to craft refined residential and hospitality interiors. You will translate concepts into detailed, buildable designs that elevate the everyday experience of our spaces.",
    responsibilities: [
      "Develop interior concepts, moodboards, and material palettes.",
      "Produce detailed interior drawings and specifications.",
      "Coordinate with architects and MEP consultants.",
      "Select finishes, furniture, lighting, and fixtures.",
      "Review samples and mockups for quality.",
      "Present design intent to clients and stakeholders.",
    ],
    requirements: [
      "Bachelor's degree in Interior Design or Architecture.",
      "3+ years of experience in high-end interiors.",
      "Proficiency in AutoCAD, SketchUp, and 3ds Max.",
      "Strong sense of materiality, detail, and proportion.",
      "Excellent visual and verbal presentation skills.",
      "Portfolio of delivered interior projects.",
    ],
  },
  {
    slug: "sales-consultant",
    title: "Sales Consultant",
    type: "Full Time",
    department: "Commercial",
    description: "Lead high-end architectural projects from concept to completion.",
    location: "Cairo, Egypt",
    intro:
      "We are looking for a Sales Consultant to guide clients through their journey with LARZ. You will build lasting relationships and present our developments with clarity, insight, and integrity.",
    responsibilities: [
      "Advise clients on available units and payment plans.",
      "Conduct property tours and presentations.",
      "Maintain an accurate pipeline in the CRM.",
      "Achieve monthly and quarterly sales targets.",
      "Build long-term relationships with clients and brokers.",
      "Represent LARZ at exhibitions and events.",
    ],
    requirements: [
      "Bachelor's degree in Business or a related field.",
      "3+ years of real estate sales experience.",
      "Proven track record of meeting targets.",
      "Excellent negotiation and communication skills.",
      "Fluency in Arabic and English.",
      "Strong client-service mindset.",
    ],
  },
];
