
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-white dark:bg-black">
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

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link
                                href="/signup"
                                className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="#demo"
                                className="w-full sm:w-auto rounded-lg px-8 py-3.5 text-base font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
                            >
                                View Demo
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                        </div>
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
