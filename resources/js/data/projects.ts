import gallery1 from '@assets/Gallery_1.webp';
import gallery2 from '@assets/Gallery_2.webp';
import gallery3 from '@assets/Gallery_3.webp';
import gallery4 from '@assets/Gallery_4.webp';
import gallery5 from '@assets/Gallery_5.webp';
import projectImage1 from '@assets/project_img_1.webp';
import projectImage2 from '@assets/project_img_2.webp';
import projectImage3 from '@assets/project_img_3.webp';
import projectImage4 from '@assets/project_img_4.webp';

export const projects = [
    {
        slug: 'kov-new-cairo',
        title: 'KOV New Cairo',
        location: 'Golden Square, New Cairo',
        image: projectImage1,
        status: 'Under construction',
        tagline: 'Where the Golden Square finally slows down.',
        intro: 'KOV New Cairo brings retail, offices and clinics into one calm, walkable address in the heart of the Golden Square — designed around daylight, open plazas and easy arrival.',
        facts: [{ label: 'Land area', value: '12 feddans' }, { label: 'Typology', value: 'Mixed-use' }, { label: 'Delivery', value: '2027' }, { label: 'Units', value: '180+' }],
        highlights: ['Double-height retail frontage along the main spine', 'Panoramic office floors with private terraces', 'Three levels of covered parking with direct lift access', 'Landscaped plaza with water features and shaded seating'],
        gallery: [gallery1, gallery2, gallery3],
    },
    {
        slug: 'larz-business-hub',
        title: 'LARZ Business Hub',
        location: 'New Cairo',
        image: projectImage2,
        status: 'Now selling',
        tagline: 'A workplace that behaves like a neighbourhood.',
        intro: 'Flexible office floors, ground-level cafés and a courtyard that keeps the working day human — built for companies that want presence without noise.',
        facts: [{ label: 'Land area', value: '8 feddans' }, { label: 'Typology', value: 'Offices & retail' }, { label: 'Delivery', value: '2026' }, { label: 'Units', value: '120+' }],
        highlights: ['Column-free floor plates from 60 to 400 m²', 'Central courtyard with all-day shade', 'Dedicated visitor drop-off and valet', 'Smart access and building management systems'],
        gallery: [gallery2, gallery4, gallery5],
    },
    {
        slug: 'larz-medical-park',
        title: 'LARZ Medical Park',
        location: 'New Cairo',
        image: projectImage3,
        status: 'Now selling',
        tagline: 'Care, planned around calm.',
        intro: 'A clinics-and-labs destination with quiet waiting areas, generous circulation and parking that never becomes part of the appointment.',
        facts: [{ label: 'Land area', value: '6 feddans' }, { label: 'Typology', value: 'Medical' }, { label: 'Delivery', value: '2027' }, { label: 'Units', value: '90+' }],
        highlights: ['Clinic units from 45 m² with flexible fit-out', 'Separate patient and staff circulation', 'Pharmacy and diagnostics on the ground floor', 'Naturally lit waiting lounges'],
        gallery: [gallery3, gallery1, gallery5],
    },
    {
        slug: 'larz-riverside',
        title: 'LARZ Riverside',
        location: 'New Cairo',
        image: projectImage4,
        status: 'Coming soon',
        tagline: 'Living close to water, and to everything.',
        intro: 'Low-rise residences arranged around lakes and open green, with terraces that face the landscape instead of the street.',
        facts: [{ label: 'Land area', value: '18 feddans' }, { label: 'Typology', value: 'Residential' }, { label: 'Delivery', value: '2028' }, { label: 'Units', value: '240+' }],
        highlights: ['Apartments, duplexes and garden homes', 'Only 22% of the land built on', 'Lakeside walking and cycling loop', 'Clubhouse, pools and family lawns'],
        gallery: [gallery4, gallery5, gallery2],
    },
] as const;

export type Project = (typeof projects)[number];
