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
            { label: 'Home Page', href: '/admin/pages/home', permission: 'pages.view', children: ['hero', 'stats', 'featured-projects', 'gallery', 'final-cta'].map((section) => ({ label: ({ hero: 'Hero Section', stats: 'Statistics', 'featured-projects': 'Featured Projects', gallery: 'Gallery', 'final-cta': 'Final CTA' } as Record<string, string>)[section], href: `/admin/pages/home/${section}`, permission: 'pages.view' })).concat([{ label: 'Testimonials', href: '/admin/pages/home/testimonials', permission: 'pages.view' }]) },
            { label: 'About Us', href: '/admin/pages/about', permission: 'pages.view', children: ['hero', 'stats', 'story', 'awards', 'partners', 'promise-cta'].map((section) => ({ label: ({ hero: 'Hero Section', stats: 'Statistics', story: 'Our Story', awards: 'Awards Section', partners: 'Partners & Affiliations', 'promise-cta': 'Promise CTA' } as Record<string, string>)[section], href: `/admin/pages/about/${section}`, permission: 'pages.view' })) },
            { label: 'Media Page', href: '/admin/pages/media', permission: 'pages.view', children: ['hero', 'news', 'stories', 'gallery', 'newsletter'].map((section) => ({ label: ({ hero: 'Hero Section', news: 'News & Press Section', stories: 'Stories & Insights Section', gallery: 'Photo Gallery Section', newsletter: 'Newsletter CTA' } as Record<string, string>)[section], href: `/admin/pages/media/${section}`, permission: 'pages.view' })) },
            { label: 'Careers Page', href: '/admin/pages/careers', permission: 'pages.view', children: ['hero', 'values', 'vacancies-settings', 'internship', 'general-cv-cta'].map((section) => ({ label: ({ hero: 'Hero Section', values: 'Why LARZ / Company Values', 'vacancies-settings': 'Vacancies Section Settings', internship: 'Internship Section', 'general-cv-cta': 'General CV CTA' } as Record<string, string>)[section], href: `/admin/pages/careers/${section}`, permission: 'pages.view' })) },
            { label: 'Contact Us', href: '/admin/pages/contact', permission: 'pages.view', children: ['hero', 'contact-methods', 'request-form', 'location-map', 'social-media', 'final-cta'].map((section) => ({ label: ({ hero: 'Hero Section', 'contact-methods': 'Contact Methods', 'request-form': 'Request Form Settings', 'location-map': 'Location & Map', 'social-media': 'Social Media Section', 'final-cta': 'Final CTA' } as Record<string, string>)[section], href: `/admin/pages/contact/${section}`, permission: 'pages.view' })) },
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
            { label: 'Projects', href: '/admin/projects', permission: 'projects.view', children: [
                { label: 'All Projects', href: '/admin/projects', permission: 'projects.view' },
                { label: 'Project Categories', href: '/admin/project-categories', permission: 'projects.view' },
                { label: 'Project Galleries', href: '/admin/project-galleries', permission: 'projects.view' },
                { label: 'Unit Types', href: '/admin/project-units', permission: 'projects.view' },
                { label: 'Amenities', href: '/admin/amenities', permission: 'projects.view' },
                { label: 'Construction Updates', href: '/admin/project-updates', permission: 'projects.view' },
                { label: 'Nearby Locations', href: '/admin/nearby-locations', permission: 'projects.view' },
            ] },
            { label: 'Media Content', href: '/admin/media/posts', permission: 'media.view', children: [
                { label: 'Press Releases', href: '/admin/media/posts?type=press', permission: 'media.view' },
                { label: 'Blog Posts', href: '/admin/media/posts?type=blog', permission: 'media.view' },
                { label: 'Media Categories', href: '/admin/media/categories', permission: 'media.view' },
                { label: 'Photo Gallery Items', href: '/admin/photo-galleries', permission: 'media.view' },
            ] },
            { label: 'Careers Management', href: '/admin/jobs', permission: 'jobs.view', children: [
                { label: 'Jobs', href: '/admin/jobs', permission: 'jobs.view' },
                { label: 'Job Applications', href: '/admin/job-applications', permission: 'applications.view' },
                { label: 'Internship Programs', href: '/admin/content/careers', permission: 'pages.view' },
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
    {
        heading: 'System',
        items: [
            { label: 'Users', href: '/admin/users', permission: 'users.manage' },
            { label: 'Roles & Permissions', href: '/admin/roles', permission: 'roles.manage' },
            { label: 'Activity Logs', href: '/admin/activity-logs', permission: 'activity-logs.view' },
        ],
    },
];
