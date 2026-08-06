import gallery1 from '@assets/Gallery_1.png';
import gallery2 from '@assets/Gallery_2.png';
import gallery3 from '@assets/Gallery_3.png';
import gallery4 from '@assets/Gallery_4.png';
import gallery5 from '@assets/Gallery_5.png';
import projectImage2 from '@assets/project_img_2.png';

export const projectStats = [
    { value: '24.', label: 'Feddans', note: 'Room to breathe' },
    { value: '20%', label: 'Built', note: 'The other 80% left open' },
    { value: 'G+5', label: 'Floors', note: 'Low-rise, no towers' },
    { value: '50–196 m²', label: 'Homes', note: 'Studios to duplexes' },
];

export const overviewImage = gallery1;
export const masterplanImage = projectImage2;
export const mapImage = gallery5;

export const homeTypes = [
    { tag: 'Studio', name: 'The Studio', size: '50–54', slug: 'kov-new-cairo' },
    { tag: '1 Bedroom', name: 'Apartment', size: '78–90', slug: 'kov-new-cairo' },
    { tag: '2 Bedroom', name: 'Apartment', size: '99–116', slug: 'kov-new-cairo' },
    { tag: 'Grand 2 Bed', name: 'Apartment', size: '125–143', slug: 'larz-riverside' },
    { tag: '3 Bedroom', name: 'Apartment', size: '150–161', slug: 'larz-riverside' },
    { tag: 'Grand 3 Bed', name: 'Apartment', size: '170–175', slug: 'larz-business-hub' },
    { tag: 'Signature 3 Bed', name: 'Apartment', size: '179–190', slug: 'larz-medical-park' },
    { tag: 'Duplex', name: 'The Duplex', size: '190–196', slug: 'larz-riverside' },
];

export const constructionUpdates = [
    { image: gallery2, tag: 'Latest update', title: 'Structure & landscaping progress' },
    { image: gallery3, tag: 'Previous', title: 'Foundations & clusters' },
    { image: gallery4, tag: 'Earlier', title: 'Groundworks begin' },
];

export const amenityGroups = [
    {
        group: 'Wellness & movement',
        items: [
            { icon: 'user', title: 'Yoga deck', note: 'Mornings that start calm, above the water.' },
            { icon: 'book', title: 'Reading nook', note: "A quiet corner that's just yours." },
            { icon: 'bike', title: 'Cycling & jogging', note: 'Your daily loop through the green.' },
            { icon: 'dumbbell', title: 'Gym & fitness', note: 'A workout that never means a commute.' },
        ],
    },
    {
        group: 'Water & leisure',
        items: [
            { icon: 'waves', title: 'Community pool', note: 'For leisurely swims and lounging.' },
            { icon: 'moon', title: 'Clubhouse pool', note: 'An adults-only pool to unwind.' },
            { icon: 'droplet', title: 'Water features', note: 'Lakes and water that cool the air.' },
            { icon: 'users', title: 'Social club', note: 'Where neighbours become friends.' },
        ],
    },
    {
        group: 'Family & everyday',
        items: [
            { icon: 'baby', title: "Children's play areas", note: 'Somewhere safe to let them run.' },
            { icon: 'dog', title: 'Dog park', note: "The best part of your dog's day." },
            { icon: 'leaf', title: 'Green spaces', note: 'Garden wherever you look.' },
            { icon: 'flame', title: 'Barbecue area', note: 'Weekend lunches, outdoors.' },
        ],
    },
] as const;

export const drives = [
    { place: 'North Teseen Road', time: '1 min' },
    { place: 'Rehab City', time: '3 min' },
    { place: "General Prosecutor's Office", time: '5 min' },
    { place: 'American University in Cairo', time: '7 min' },
    { place: 'New Administrative Capital', time: '20 min' },
];
