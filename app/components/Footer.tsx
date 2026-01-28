import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-white border-t border-zinc-200 dark:bg-black dark:border-zinc-800" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:pt-24 lg:px-8 lg:pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Brand & Social */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="SignPubliQ Logo"
                                width={48}
                                height={48}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-sm">
                            Legally binding eSignatures with audit trails and compliance you can trust. anytime, anywhere.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-primary transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-16 lg:mt-0">
                        <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50">Company</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="mt-16 lg:mt-0">
                        <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-50">Contact Us</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li className="flex items-center gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>support@signpubliq.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span>123 Market St, Suite 100<br />San Francisco, CA 94103</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-zinc-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-zinc-50/10">
                    <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                        &copy; 2024 SignPubliQ, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
