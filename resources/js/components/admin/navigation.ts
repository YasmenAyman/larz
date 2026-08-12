export type AdminNavigationItem = {
    label: string;
    href: string;
    permission?: string;
    children?: AdminNavigationItem[];
};

export type AdminNavigationGroup = {
    heading?: string;
    items: AdminNavigationItem[];
};

export const adminNavigation: AdminNavigationGroup[] = [
    { items: [{ label: 'Dashboard', href: '/admin/dashboard', permission: 'dashboard.view' }] },
    {
        heading: 'Website Pages',
        items: [
            { label: 'Home Page', href: '/admin/pages/home', permission: 'pages.view', children: [
                { label: 'Hero Section', href: '/admin/pages/home/hero', permission: 'pages.view' },
                { label: 'Statistics', href: '/admin/pages/home/stats', permission: 'pages.view' },
                { label: 'Featured Projects', href: '/admin/pages/home/featured-projects', permission: 'pages.view' },
                { label: 'Gallery', href: '/admin/pages/home/gallery', permission: 'pages.view' },
                { label: 'Testimonials', href: '/admin/pages/home/testimonials', permission: 'pages.view' },
            ] },
            { label: 'About Us', href: '/admin/pages/about', permission: 'pages.view', children: [
                { label: 'Hero Section', href: '/admin/pages/about/hero', permission: 'pages.view' },
                { label: 'Statistics', href: '/admin/pages/about/stats', permission: 'pages.view' },
                { label: 'Our Story', href: '/admin/pages/about/story', permission: 'pages.view' },
                { label: 'Awards & Achievements', href: '/admin/pages/about/awards', permission: 'pages.view' },
                { label: 'Partnerships & Affiliations', href: '/admin/pages/about/partners', permission: 'pages.view' },
                { label: 'Promise CTA', href: '/admin/pages/about/promise-cta', permission: 'pages.view' },
            ] },
            { label: 'Projects', href: '/admin/projects', permission: 'projects.view' },
            { label: 'Media', href: '/admin/pages/media', permission: 'pages.view', children: [
                { label: 'Hero Section', href: '/admin/pages/media/hero', permission: 'pages.view' },
                { label: 'News & Press Releases', href: '/admin/pages/media/news', permission: 'pages.view' },
                { label: 'Blogs', href: '/admin/pages/media/stories', permission: 'pages.view' },
                { label: 'Photo Gallery', href: '/admin/pages/media/gallery', permission: 'pages.view' },
                { label: 'Newsletter CTA', href: '/admin/pages/media/newsletter', permission: 'pages.view' },
            ] },
            { label: 'Careers', href: '/admin/pages/careers', permission: 'pages.view', children: [
                { label: 'Hero Section', href: '/admin/pages/careers/hero', permission: 'pages.view' },
                { label: 'Why LARZ / Values', href: '/admin/pages/careers/values', permission: 'pages.view' },
                { label: 'Vacancies', href: '/admin/pages/careers/vacancies-settings', permission: 'pages.view' },
                { label: 'Internship Programs', href: '/admin/pages/careers/internship', permission: 'pages.view' },
                { label: 'General CV CTA', href: '/admin/pages/careers/general-cv-cta', permission: 'pages.view' },
            ] },
            { label: 'Contact Us', href: '/admin/pages/contact', permission: 'pages.view', children: [
                { label: 'Hero Section', href: '/admin/pages/contact/hero', permission: 'pages.view' },
                { label: 'Hotline / Contact Methods', href: '/admin/pages/contact/contact-methods', permission: 'pages.view' },
                { label: 'Request Form', href: '/admin/pages/contact/request-form', permission: 'pages.view' },
                { label: 'Location & Map', href: '/admin/pages/contact/location-map', permission: 'pages.view' },
                { label: 'Social Media', href: '/admin/pages/contact/social-media', permission: 'pages.view' },
            ] },
        ],
    },
    {
        heading: 'Global Website',
        items: [
            { label: 'Navigation', href: '/admin/navigation', permission: 'navigation.view' },
            { label: 'Global Settings', href: '/admin/settings', permission: 'settings.view' },
            { label: 'SEO Settings', href: '/admin/seo', permission: 'seo.view' },
        ],
    },
    {
        heading: 'Content Management',
        items: [
            { label: 'Media Content', href: '/admin/media/posts', permission: 'media.view' },
            { label: 'Careers Management', href: '/admin/jobs', permission: 'jobs.view', children: [
                { label: 'Jobs', href: '/admin/jobs', permission: 'jobs.view' },
                { label: 'Job Applications', href: '/admin/job-applications', permission: 'applications.view' },
                { label: 'Internship Applications', href: '/admin/internship-applications', permission: 'applications.view' },
                { label: 'General CV Submissions', href: '/admin/general-cv-submissions', permission: 'applications.view' },
            ] },
        ],
    },
    {
        heading: 'Leads & Requests',
        items: [
            { label: 'Contact Inquiries', href: '/admin/contact-inquiries', permission: 'inquiries.view' },
            { label: 'Project Inquiries', href: '/admin/project-inquiries', permission: 'inquiries.view' },
            { label: 'Brochure Requests', href: '/admin/brochure-requests', permission: 'inquiries.view' },
            { label: 'Newsletter Subscribers', href: '/admin/newsletter-subscribers', permission: 'newsletter.view' },
        ],
    },
];
