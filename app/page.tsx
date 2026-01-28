import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import Features from "./components/home/Features";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
