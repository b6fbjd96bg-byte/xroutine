import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import ReferPromo from "@/components/landing/ReferPromo";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";
import { Link } from "react-router-dom";
import Seo, { softwareAppLd } from "@/seo/Seo";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="Superoutine – AI Habit Tracker & Routine Planner"
        description="Build better habits with Superoutine's AI coach, XP levels, streaks and analytics. Plans from $4.99/mo. Start your 15-day free trial."
        path="/"
        jsonLd={[softwareAppLd]}
      />
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
            Superoutine (sometimes written Super Routine) is an AI habit tracker and routine planner. It combines a daily habit
            grid, weekly habits, XP levels, streaks, routines, a to-do list and an AI coach in one web app that works on desktop and phone.
            Pro costs $4.99 a month, $39 a year or $79 lifetime, after a 15-day free trial with every feature. See{" "}
            <Link to="/features" className="text-primary hover:underline">all features</Link>,{" "}
            <Link to="/pricing" className="text-primary hover:underline">pricing</Link> or the{" "}
            <Link to="/faq" className="text-primary hover:underline">FAQ</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
