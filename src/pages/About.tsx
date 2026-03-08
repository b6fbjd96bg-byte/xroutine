import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Twitter, Globe, Code2, Rocket, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            The Creator Behind Superoutine
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Made by{" "}
            <span className="text-gradient">Jatin Kumar</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A passionate developer building tools that help people transform their daily habits into lasting behavioral change.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card p-8 sm:p-10 mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-chart-purple/30 border border-border/50 flex items-center justify-center text-4xl font-bold font-display text-primary shrink-0">
              JK
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold font-display mb-2">Jatin Kumar</h2>
              <p className="text-primary font-medium mb-4">Full-Stack Developer & Creator</p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm Jatin Kumar, the solo developer behind Superoutine. I built this app because I believe that building good habits shouldn't feel like a chore — it should feel like a game. My mission is to make self-improvement accessible, fun, and sustainable for everyone.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </Button>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </Button>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Twitter className="w-4 h-4" /> Twitter
                  </Button>
                </a>
                <a href="https://superoutine.pro" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" /> Website
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision & Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-6 mb-12"
        >
          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">The Vision</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To build the most engaging habit-tracking experience that uses gamification, psychology, and beautiful design to help millions build better routines.
            </p>
          </div>
          <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl bg-chart-purple/10 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5 text-chart-purple" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Built With Care</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every feature in Superoutine is thoughtfully crafted — from the XP system and streak mechanics to the calming dark UI — all designed to keep you motivated without overwhelming you.
            </p>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="glass-card p-8 mb-12"
        >
          <h3 className="text-xl font-bold font-display mb-6 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Vite", "Recharts", "Radix UI"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg bg-secondary/80 border border-border/50 text-sm font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">
            Liked what you see? Start building better habits today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="lg">Get Started Free</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Get in Touch</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
