
import { ShieldCheck, Smartphone, Bell, FileText, Globe, Zap } from 'lucide-react';

const Features = () => {
    const features = [
        {
            name: "Secure & Compliant",
            description: "Bank-grade security with ESIGN and eIDAS compliance. Your documents are encrypted and protected.",
            icon: ShieldCheck,
        },
        {
            name: "Multi-device Access",
            description: "Sign on any device—mobile, tablet, or desktop. No app download required for signers.",
            icon: Smartphone,
        },
        {
            name: "Real-time Tracking",
            description: "Get instant notifications when documents are opened, viewed, and signed. Never lose track.",
            icon: Bell,
        },
        {
            name: "Templates & Workflows",
            description: "Create reusable templates for frequently used documents. Automate your signing workflows.",
            icon: FileText,
        },
        {
            name: "Global Acceptance",
            description: "Legally binding in 180+ countries. Do business globally without borders.",
            icon: Globe,
        },
        {
            name: "Lightning Fast",
            description: "Speed up turnaround times by up to 80%. Close deals faster with instant delivery.",
            icon: Zap,
        },
    ];

    return (
        <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        Everything you need to sign faster
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Powerful tools designed to simplify your document workflow and boost productivity.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all hover:shadow-md dark:bg-zinc-900 dark:ring-white/10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <dt className="text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                        {feature.description}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default Features;
