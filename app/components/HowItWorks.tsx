
import { Upload, UserPlus, Send } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            title: "Upload your document",
            description: "Simply drag and drop your files or import them from cloud storage.",
            icon: Upload,
        },
        {
            title: "Add recipients & signature fields",
            description: "Specify who needs to sign and where. Add custom fields as needed.",
            icon: UserPlus,
        },
        {
            title: "Send, sign, and download signed copy",
            description: "Track progress in real-time and download the legally binding signed copy.",
            icon: Send,
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Get your documents signed in three simple steps.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 dark:bg-zinc-900 transition-colors group-hover:bg-primary/10">
                                    <step.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                                </div>
                                <h3 className="text-xl font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                                    Step {index + 1}: {step.title}
                                </h3>
                                <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
