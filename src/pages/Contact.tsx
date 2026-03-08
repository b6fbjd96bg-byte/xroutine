import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Mail, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200));
    toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            We'd love to hear from you
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Contact & <span className="text-gradient">Support</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a question, feedback, or need help? Reach out and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-1 space-y-4"
          >
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold font-display mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@superoutine.pro</p>
            </div>
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-chart-purple/10 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5 text-chart-purple" />
              </div>
              <h3 className="font-bold font-display mb-1">FAQ</h3>
              <p className="text-sm text-muted-foreground">Check our <Link to="/#faq" className="text-primary hover:underline">FAQ section</Link> for common questions.</p>
            </div>
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-chart-blue/10 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-chart-blue" />
              </div>
              <h3 className="font-bold font-display mb-1">Response Time</h3>
              <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2"
          >
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold font-display mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={loading}>
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
