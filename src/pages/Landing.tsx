import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import ReferPromo from "@/components/landing/ReferPromo";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <ReferPromo />
        <CTASection />
        <section aria-label="About Superoutine" className="max-w-4xl mx-auto px-4 pb-16 text-center">
          <h2 className="text-2xl font-bold font-display mb-3">The AI habit tracker built for real routines</h2>
          <p className="text-muted-foreground leading-relaxed">
            Superoutine (also known as Super Routine) is a routine habit tracker with an AI coach, XP levels,
            streaks, routines and a to-do calendar. It is one of the most affordable habit trackers — Pro starts
            at just $4.99 a month with a 15-day free trial — so anyone can build better habits and make their life better, one day at a time.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
