import projectImage1 from '@assets/project_img_1.png';
import projectImage2 from '@assets/project_img_2.png';
import projectImage3 from '@assets/project_img_3.png';
import projectImage4 from '@assets/project_img_4.png';
import gallery1 from '@assets/Gallery_1.png';
import gallery2 from '@assets/Gallery_2.png';
import gallery3 from '@assets/Gallery_3.png';
import gallery4 from '@assets/Gallery_4.png';
import gallery5 from '@assets/Gallery_5.png';
import user1 from '@assets/user_1.png';
import user2 from '@assets/user_2.png';

export const projects = [
    {
        slug: 'kov-new-cairo',
        title: 'KOV New Cairo',
        location: 'Golden Square, New Cairo',
        image: projectImage1,
    },
    {
        slug: 'larz-business-hub',
        title: 'LARZ Business Hub',
        location: 'New Cairo',
        image: projectImage2,
    },
    {
        slug: 'larz-medical-park',
        title: 'LARZ Medical Park',
        location: 'New Cairo',
        image: projectImage3,
    },
    {
        slug: 'larz-riverside',
        title: 'LARZ Riverside',
        location: 'New Cairo',
        image: projectImage4,
    },
] as const;

export const gallery = [gallery1, gallery2, gallery3, gallery4, gallery5];

export const testimonials = [
    {
        quote:
            '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."',
        name: 'Ahmed K.',
        role: 'Business Owner',
        image: user2,
    },
    {
        quote:
            '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."',
        name: 'Muhammed Y.',
        role: 'Homeowner',
        image: user1,
    },
    {
        quote:
            '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."',
        name: 'Ahmed K.',
        role: 'Business Owner',
        image: user2,
    },
    {
        quote:
            '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."',
        name: 'Muhammed Y.',
        role: 'Homeowner',
        image: user1,
    },
];
