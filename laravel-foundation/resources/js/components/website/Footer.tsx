import { Link, usePage } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { PillButton } from '@/components/shared/PillButton';
import footerBackground from '@assets/Footer_bg.png';
import type { WebsiteSharedProps } from '@/types/website';

export function Footer() {
    const { props } = usePage<WebsiteSharedProps>();
    const settings = props.site?.settings ?? {};
    const navigation = props.site?.navigation ?? [];
    const footerMenu = navigation.filter((link) => link.location === 'footer').map((link) => ({ label: link.label, to: link.url }));
    const contact = { address: settings['contact.address'] ?? 'New Cairo, Egypt', email: settings['contact.email'] ?? 'info@larzdevelopments.com', phone: settings['contact.phone'] ?? '15813' };
    const footerTitle = (settings['footer.cta_title'] ?? "Let's Build\nThe Future Together").split('\n');
    return (
        <footer className="relative overflow-hidden rounded-t-[2.5rem]" style={{ backgroundImage: `url(${footerBackground})`, backgroundSize: 'cover' }}>
            <div className="relative mx-auto max-w-[1440px] px-4 py-12 !pb-5 sm:px-8 sm:py-20">
                <h2 className="text-center text-2xl leading-[1.3] font-bold text-ink sm:text-4xl md:text-[55px]">
                    {footerTitle[0]}
                    <br />
                    {footerTitle[1]}
                </h2>
                <div className="mt-8 flex justify-center">
                    <PillButton label={settings['footer.cta_button'] ?? 'Get In Touch'} to="/contact" />
                </div>

                <div className="mt-14 grid gap-10 rounded-2xl border border-hairline/90 bg-surface/30 p-8 backdrop-blur-sm md:grid-cols-3 md:p-12">
                    <div className="flex items-center md:justify-center">
                        <Logo size="lg" withTagline />
                    </div>

                    <nav aria-label="Footer">
                        <h3 className="text-lg text-ink">Menu</h3>
                        <ul className="mt-6 space-y-4">
                            {footerMenu.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.to} className="text-sm text-ink/90 hover:text-ink">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h3 className="text-lg text-ink">Get in Touch</h3>
                        <ul className="mt-6 space-y-5 text-sm text-ink/90">
                            <li className="flex gap-3">
                                <MapPin className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
                                <span className="leading-relaxed">{contact.address}</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="size-5 shrink-0" strokeWidth={2} />
                                <a href={`mailto:${contact.email}`} className="hover:text-ink">
                                    {contact.email}
                                </a>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="size-5 shrink-0" strokeWidth={2} />
                                <a href={`tel:${contact.phone}`} className="hover:text-ink">
                                    {contact.phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    <p className="text-sm text-ink">
                        Developed by <span className="font-semibold text-ink">TQNIA</span> All Rights reserved
                    </p>
                    <ul className="flex items-center gap-3">
                        {[
                            { Icon: Facebook, label: 'Facebook' },
                            { Icon: Instagram, label: 'Instagram' },
                            { Icon: Linkedin, label: 'LinkedIn' },
                        ].map(({ Icon, label }) => (
                            <li key={label}>
                                <a href="#" aria-label={label} className="grid size-11 place-items-center rounded-full border border-hairline text-ink">
                                    <Icon className="size-5" strokeWidth={2} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
