
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-8 pb-10 lg:pt-12 lg:pb-14 bg-white dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            The #1 eSignature Solution
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl">
                            Send, Sign & Manage <br className="hidden lg:block" />
                            <span className="text-primary">Documents Faster.</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
                            Secure, legally binding eSignatures with complete audit trails.
                            Streamline your agreements and close deals in minutes, not days.
                        </p>

                        {/* Buttons and Trust Signals removed as per request */}

                    </div>

                    {/* Right Image */}
                    <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
                        <div className="relative rounded-2xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <Image
                                src="/hero-image.png"
                                alt="SignPubliQ Dashboard Interface"
                                width={2432}
                                height={1442}
                                className="w-[76rem] rounded-xl shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
