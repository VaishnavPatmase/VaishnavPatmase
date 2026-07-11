import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Zap,
  Grid,
  FileText,
  Monitor,
  BarChart3,
  Globe,
  Clock,
  Copy,
  Check,
  Mail,
  ArrowRight,
  ArrowUp,
  Menu,
  X,
  ChevronRight,
  Star,
  Compass,
  Users,
  Target,
  Award,
} from "lucide-react";

// Custom Components
import FluidParticlesBackground from "./components/FluidParticlesBackground";
import TiltCard from "./components/TiltCard";
import Scroll3DSection from "./components/Scroll3DSection";
import Counter from "./components/Counter";
import GlobalClocks from "./components/GlobalClocks";

// Framer motion variants for staggering reveal animations
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const fadeInUpItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] // premium easeOutExpo
    }
  }
};

export default function App() {
  // UI Customizer States (allows the user to select and refine the workspace UI live)
  const [themePreset, setThemePreset] = useState<"cosmic" | "solar" | "cyberpunk" | "emerald">("cosmic");
  const [density, setDensity] = useState<"low" | "medium" | "high">("medium");
  const [showLines, setShowLines] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [isControlDeskOpen, setIsControlDeskOpen] = useState(false);

  // Dynamic Theme mappings for absolute customizer selections
  const textAccent = {
    cosmic: "text-transparent bg-clip-text bg-gradient-to-r from-blue-450 via-sky-300 to-purple-400",
    solar: "text-transparent bg-clip-text bg-gradient-to-r from-amber-450 via-orange-400 to-rose-450",
    cyberpunk: "text-transparent bg-clip-text bg-gradient-to-r from-pink-450 via-fuchsia-300 to-cyan-400",
    emerald: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 via-teal-300 to-sky-400",
  }[themePreset];

  const brandIconBg = {
    cosmic: "from-blue-600 to-sky-450 shadow-blue-500/20",
    solar: "from-amber-600 to-orange-450 shadow-amber-500/20",
    cyberpunk: "from-pink-600 to-fuchsia-450 shadow-pink-500/20",
    emerald: "from-emerald-600 to-teal-450 shadow-emerald-500/20",
  }[themePreset];

  const glowColorClass = {
    cosmic: "shadow-blue-500/10 hover:shadow-blue-500/20 border-blue-500/20 hover:border-blue-500/40",
    solar: "shadow-amber-500/10 hover:shadow-amber-500/20 border-amber-500/20 hover:border-amber-500/40",
    cyberpunk: "shadow-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20 hover:border-pink-500/40",
    emerald: "shadow-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/40",
  }[themePreset];

  const btnPrimaryClass = {
    cosmic: "from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-blue-500/25",
    solar: "from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25",
    cyberpunk: "from-pink-600 to-fuchsia-500 hover:from-pink-500 hover:to-fuchsia-400 text-white shadow-lg shadow-pink-500/25",
    emerald: "from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25",
  }[themePreset];

  const badgeClass = {
    cosmic: "bg-blue-500/10 border-blue-500/20 text-blue-450",
    solar: "bg-amber-500/10 border-amber-500/20 text-amber-450",
    cyberpunk: "bg-pink-500/10 border-pink-500/20 text-pink-450",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-450",
  }[themePreset];

  const badgeDot = {
    cosmic: "bg-blue-500",
    solar: "bg-amber-500",
    cyberpunk: "bg-pink-500",
    emerald: "bg-emerald-500",
  }[themePreset];

  const accentColorText = {
    cosmic: "text-blue-400",
    solar: "text-amber-400",
    cyberpunk: "text-pink-400",
    emerald: "text-emerald-400",
  }[themePreset];

  const accentTimelineNode = {
    cosmic: "border-blue-500 group-hover:border-blue-400",
    solar: "border-amber-500 group-hover:border-amber-400",
    cyberpunk: "border-pink-500 group-hover:border-pink-400",
    emerald: "border-emerald-500 group-hover:border-emerald-400",
  }[themePreset];

  // Navigation active states
  const [activeSection, setActiveSection] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form Submission
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Clipboard Copied toast
  const [copied, setCopied] = useState(false);

  // Accordion active index for "Why Us"
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Handle navbar sticky styling & active section markers
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      // Simple active link detection
      const sections = ["services", "process", "global", "why", "contact"];
      let currentSection = "top";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Form handle changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit simulated action with beautiful visual modal success
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate database / server-side dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
      // Construct mailto as a fallback option for standard mail clients
      const subject = encodeURIComponent(`New marketing enquiry from ${formState.name}`);
      const body = encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\nCompany: ${formState.company || "N/A"}\n\nMessage:\n${formState.message}`
      );
      
      // Auto open mailto in window safely
      window.location.href = `mailto:info@digitalitmove.com?subject=${subject}&body=${body}`;
    }, 1200);
  };

  // Copy email utility
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("info@digitalitmove.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Custom data arrays
  const services = [
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: "SEO & Organic Growth",
      desc: "Technical audits, semantic content networks, and premium link authority building that elevate your brand for searches that convert.",
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Paid Media & PPC",
      desc: "Google Search, Meta Ads, and programmatic arrays optimized continuously against core cost-per-acquisition metrics, not empty impressions.",
    },
    {
      icon: <Grid className="w-6 h-6 text-sky-400" />,
      title: "Social Media Management",
      desc: "Dynamic content strategies, native video productions, and algorithmic engagement campaigns that build real community loyalty.",
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
      title: "Content & Creative Hub",
      desc: "High-retention copy, customized design systems, and cinematic digital motion assets that tell your brand story with authority.",
    },
    {
      icon: <Monitor className="w-6 h-6 text-pink-400" />,
      title: "Web Design & Engineering",
      desc: "Stunning, conversion-optimized responsive web builds. Fast loading, secure, and engineered to turn traffic into pipeline.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: "Branding & Market Strategy",
      desc: "Competitive positioning, audience profiling, and market validation strategies that make all downstream ad channels work twice as hard.",
    },
  ];

  const processSteps = [
    {
      num: "01",
      title: "Discover",
      desc: "Deep digital footprint audits, target competitor indexing, and organic opportunity modeling to establish growth baselines.",
    },
    {
      num: "02",
      title: "Plan",
      desc: "Channels deployment blueprints, budget distribution models, and quantitative monthly KPI targets outlined transparently.",
    },
    {
      num: "03",
      title: "Execute",
      desc: "Campaign architectures go live across Australian, Indian, and Dubai expert teams under a single unified playbook.",
    },
    {
      num: "04",
      title: "Optimise",
      desc: "Algorithmic adjustments, real-time bid capping, and content tests to shift media budgets to the highest yield vectors.",
    },
  ];

  const offices = [
    {
      tag: "HEADQUARTERS",
      country: "Australia",
      city: "Sydney Hub",
      bulletPoints: [
        "Core marketing strategy & high-level advisory",
        "Australian market positioning & local leadership",
        "Main communications & master analytics reports",
      ],
      color: "from-blue-600/20 to-blue-900/10 border-blue-500/30",
      accentGlow: "bg-blue-500/20",
    },
    {
      tag: "ENGINEERING HUB",
      country: "India",
      city: "New Delhi delivery Desk",
      bulletPoints: [
        "Advanced SEO architecture & link acquisition",
        "Cinematic video editing & creative content assets",
        "Full-stack conversion web builds & engineering",
      ],
      color: "from-purple-600/20 to-purple-900/10 border-purple-500/30",
      accentGlow: "bg-purple-500/20",
    },
    {
      tag: "GROWTH DESK",
      country: "Dubai",
      city: "MENA desk",
      bulletPoints: [
        "Middle East marketing channels & regional partnerships",
        "Bespoke luxury brand positioning & localized campaign copy",
        "Cross-border media spend optimization",
      ],
      color: "from-sky-600/20 to-sky-900/10 border-sky-500/30",
      accentGlow: "bg-sky-500/20",
    },
  ];

  const whyUsFactors = [
    {
      title: "True Unified Agency",
      desc: "Most agencies white-label or fragment their processes across loose networks. We operate as a single global squad. Strategy, copywriting, media buying, and software engineering sit at the same table.",
    },
    {
      title: "24/7 Follow-The-Sun Workspace",
      desc: "Because our offices span Sydney, India, and Dubai, our team overlaps across three distinct time zones. This allows us to monitor bids, adjust budgets, and push code around the clock.",
    },
    {
      title: "Full Funnel Transparency",
      desc: "We completely ban vanity metrics like impressions and clicks from our executive summaries. We measure and report on what actually matters to your balance sheet: Pipeline value, cost-per-acquisition, and ROAS.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-navy-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. INTERACTIVE BACKGROUND: Fluid Particle canvas */}
      <FluidParticlesBackground
        preset={themePreset}
        density={density}
        showLines={showLines}
        speedMultiplier={speedMultiplier}
      />

      {/* 2. HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-navy-950/85 backdrop-blur-md border-slate-800/80 py-4 shadow-xl shadow-navy-950/30"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            {/* Custom Interactive SVG Logo */}
            <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-tr ${brandIconBg} p-[2px] shadow-lg group-hover:scale-105 transition-transform`}>
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <svg className={`w-5 h-5 ${accentColorText}`} viewBox="0 0 100 100" fill="none">
                  <path
                    d="M30 20 L75 50 L30 80"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="20"
                    y1="50"
                    x2="45"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-blue-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Digital <span className={accentColorText}>IT</span> Move
            </span>
          </a>

          {/* Desktop Navigation Link Array */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 list-none m-0 p-0">
              {["services", "process", "global", "why", "contact"].map((sec) => (
                <li key={sec}>
                  <a
                    href={`#${sec}`}
                    className={`text-sm font-medium transition-colors relative py-1.5 capitalize ${
                      activeSection === sec ? "text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sec === "global" ? "Global offices" : sec === "why" ? "Why Us" : sec}
                    {activeSection === sec && (
                      <motion.span
                        layoutId="navIndicator"
                        className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r ${
                          themePreset === "cosmic"
                            ? "from-blue-500 to-sky-400"
                            : themePreset === "solar"
                            ? "from-amber-500 to-orange-400"
                            : themePreset === "cyberpunk"
                            ? "from-pink-500 to-fuchsia-400"
                            : "from-emerald-500 to-teal-400"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-white bg-white/5 border border-slate-850 hover:border-transparent transition-all duration-300 hover:translate-y-[-2px] ${
                themePreset === "cosmic"
                  ? "hover:bg-blue-600 shadow-blue-500/5"
                  : themePreset === "solar"
                  ? "hover:bg-amber-600 shadow-amber-500/5"
                  : themePreset === "cyberpunk"
                  ? "hover:bg-pink-600 shadow-pink-500/5"
                  : "hover:bg-emerald-600 shadow-emerald-500/5"
              }`}
            >
              Get in touch →
            </a>
          </div>

          {/* Mobile toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[73px] left-0 right-0 z-40 bg-navy-950/95 border-b border-slate-800 p-6 md:hidden backdrop-blur-lg flex flex-col gap-6 shadow-2xl"
          >
            <ul className="flex flex-col gap-4 list-none m-0 p-0">
              {["services", "process", "global", "why", "contact"].map((sec) => (
                <li key={sec}>
                  <a
                    href={`#${sec}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-semibold text-slate-300 hover:text-white capitalize py-1"
                  >
                    {sec === "global" ? "Global offices" : sec === "why" ? "Why Us" : sec}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-24">
        {/* 3. HERO HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${badgeClass} border font-mono text-[11px] font-medium uppercase tracking-widest mb-6`}
              >
                <span className={`w-2 h-2 rounded-full ${badgeDot} animate-pulse`} />
                Digital Marketing Company · Sydney, Australia
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]"
              >
                We move your brand <br />
                <span className={`${textAccent} font-extrabold`}>
                  forward, digitally.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-350 leading-relaxed mt-6 max-w-xl"
              >
                Digital IT Move plans, builds, and deploys high-yield digital campaign frameworks. 
                SEO, paid media, and social strategies executed in unison across Australia, India, and Dubai.
              </motion.p>

              {/* Action Elements */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mt-8 w-full sm:w-auto"
              >
                <a
                  href="#contact"
                  className={`px-8 py-4 rounded-full text-sm font-semibold bg-gradient-to-r ${btnPrimaryClass} transition-all duration-300 flex items-center gap-2 hover:translate-y-[-3px] focus:outline-none`}
                >
                  Start a project
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#services"
                  className="px-8 py-4 rounded-full text-sm font-semibold text-slate-300 bg-slate-900/70 border border-slate-800 hover:text-white hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:translate-y-[-3px] focus:outline-none"
                >
                  See what we do
                </a>
              </motion.div>

              {/* Interactive Metrics Bar */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 sm:gap-10 mt-14 pt-8 border-t border-slate-800/80 w-full"
              >
                <div>
                  <div className="text-3xl font-display font-bold text-white">
                    <Counter value={3} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                    Countries in play
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">
                    <Counter value={120} suffix="+" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                    Campaigns launched
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">
                    <Counter value={24} suffix="/7" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                    Team on ground
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column Parallax Interactive Rings & Badges */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[420px] aspect-ratio-1"
              >
                {/* 3D Floating concentric rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[380px] h-[380px] rounded-full border border-dashed border-blue-500/20 animate-[spin_60s_linear_infinite]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[280px] h-[280px] rounded-full border border-dotted border-purple-500/25 animate-[spin_40s_linear_infinite_reverse]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[180px] h-[180px] rounded-full border border-sky-500/10" />
                </div>

                {/* Floating active particles / badges */}
                <div className="absolute top-8 right-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: "5s" }}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Star className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-mono">CLIENT RATING</span>
                    <span className="text-xs font-semibold text-white">4.9/5 Average</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: "7s", animationDelay: "1s" }}>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-mono">MAX ROAS</span>
                    <span className="text-xs font-semibold text-white">4.6x ROI Lift</span>
                  </div>
                </div>

                {/* Core Brand Mark Badge inside 3D environment */}
                <div className="relative z-10 w-full h-[400px] flex items-center justify-center">
                  <div className="relative group cursor-pointer preserve-3d" style={{ transform: "perspective(1000px) rotateY(-10deg) rotateX(10deg)" }}>
                    <div className="absolute inset-0 bg-blue-500/15 rounded-3xl blur-2xl group-hover:bg-blue-500/25 transition-colors" />
                    
                    {/* Glowing outer card */}
                    <div className="relative w-44 h-44 rounded-3xl bg-slate-950/90 border border-slate-850 p-6 flex items-center justify-center shadow-2xl">
                      {/* Geometric vector brand emblem */}
                      <svg className="w-24 h-24 text-blue-500 group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 100 100" fill="none">
                        <defs>
                          <linearGradient id="emblemGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1e7fe0" />
                            <stop offset="50%" stopColor="#63b7ff" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M20 20 L80 50 L20 80 Z"
                          stroke="url(#emblemGrad)"
                          strokeWidth="6"
                          strokeLinejoin="round"
                          className="opacity-20"
                        />
                        <path
                          d="M30 30 L70 50 L30 70 Z"
                          fill="url(#emblemGrad)"
                          className="drop-shadow-[0_0_15px_rgba(30,127,224,0.5)]"
                        />
                        <path
                          d="M48 50 L68 50"
                          stroke="#ffffff"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* 4. INFINITE MARQUEE */}
        <div className="py-6 border-y border-slate-850 bg-slate-950/40 backdrop-blur-md overflow-hidden relative w-full">
          {/* Subtle side fading gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: [0, -1035] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
              className="flex gap-16 text-xs text-slate-400 uppercase font-mono tracking-widest font-semibold"
            >
              {[
                "SEO & Organic Growth",
                "Paid Media & PPC",
                "Social Media Management",
                "Content & Creative",
                "Web Design & Development",
                "Branding & Strategy",
                "Marketing Automation",
                "Analytics & Reporting",
                "SEO & Organic Growth",
                "Paid Media & PPC",
                "Social Media Management",
                "Content & Creative",
                "Web Design & Development",
                "Branding & Strategy",
                "Marketing Automation",
                "Analytics & Reporting",
              ].map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 5. SERVICES SECTION (3D SCROLL & TILT CARDS) */}
        <Scroll3DSection id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="max-w-2xl mb-14 md:mb-18">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                What we do
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mt-4 tracking-tight leading-tight">
                Every channel that drives real customers, under one roof.
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                No fragmented vendors or finger-pointing. One unified, highly strategic team plans your channels, builds your visual assets, and manages your media.
              </p>
            </div>

            {/* Grid of 3D Tilt Cards with stagger container */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((svc, idx) => (
                <motion.div key={idx} variants={fadeInUpItem} className="h-full">
                  <TiltCard className="p-8 h-full flex flex-col items-start min-h-[250px]">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                      {svc.icon}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mt-6 mb-3 tracking-tight">
                      {svc.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {svc.desc}
                    </p>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Scroll3DSection>

        {/* 6. SIGNATURE TRAJECTORY / PROCESS */}
        <Scroll3DSection id="process">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="max-w-2xl mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                How we work
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mt-4 tracking-tight leading-tight">
                A straight line from strategy to results.
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                Four defined stages, fully synchronized workflow, complete transparency — you always know what is in flight.
              </p>
            </div>

            {/* Horizontal Timeline Block */}
            <div className="relative">
              {/* Central connection track */}
              <div className="hidden lg:block absolute left-4 right-4 top-[24px] h-[2px] bg-gradient-to-r from-slate-800 via-blue-500/40 to-slate-800" />

              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {processSteps.map((step, idx) => (
                  <motion.div key={idx} variants={fadeInUpItem} className="flex flex-col relative group">
                    {/* Node */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs text-blue-400 z-10 font-bold group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-300">
                        {step.num}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold sm:hidden lg:hidden">
                        STAGE {step.num}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mt-6 hidden lg:inline-block">
                      STAGE {step.num}
                    </span>

                    <h3 className="font-display font-semibold text-lg text-white mt-2 mb-3 tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Scroll3DSection>

        {/* 7. GLOBAL PRESENCE WITH LOCAL TIMES */}
        <Scroll3DSection id="global">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Global presence
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mt-4 tracking-tight leading-tight">
                  Headquartered in Australia. Working across three time zones.
                </h2>
                <p className="text-slate-400 mt-4 leading-relaxed max-w-xl">
                  A local point of communication backed by one seamless production group working around the clock across Sydney, Delhi, and Dubai.
                </p>
              </div>
              <div className="lg:col-span-4 w-full">
                {/* Active counters badge */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur text-sm text-slate-400 leading-relaxed">
                  Sydney coordinates overall strategy while New Delhi and Dubai manage multi-channel production and MENA distributions in unison.
                </div>
              </div>
            </div>

            {/* Active World Clocks Module */}
            <div className="mb-8">
              <GlobalClocks />
            </div>

            {/* Office branch tilt cards with stagger container */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {offices.map((office, idx) => (
                <motion.div key={idx} variants={fadeInUpItem} className="h-full">
                  <TiltCard
                    className={`bg-gradient-to-b ${office.color} backdrop-blur-md p-8 flex flex-col justify-between min-h-[340px]`}
                  >
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-slate-950/80 border border-slate-850 font-mono text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                        {office.tag}
                      </div>
                      <h3 className="font-display font-bold text-3xl text-white mt-6 tracking-tight">
                        {office.country}
                      </h3>
                      <p className="text-blue-400 text-xs font-mono font-medium mt-1 uppercase tracking-wider">
                        {office.city}
                      </p>
                    </div>

                    <ul className="list-none p-0 m-0 mt-8 space-y-3">
                      {office.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-sm text-slate-300 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Scroll3DSection>

        {/* 8. WHY US / ACCORDIONS & BENTO GRID */}
        <Scroll3DSection id="why">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Core Accordion Value Props */}
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Why Digital IT Move
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-4 mb-8 tracking-tight leading-tight">
                  Marketing judged on the metric that actually matters: predictable growth.
                </h2>

                <motion.div 
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {whyUsFactors.map((factor, idx) => {
                    const isOpen = activeAccordion === idx;
                    return (
                      <motion.div
                        key={idx}
                        variants={fadeInUpItem}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "bg-slate-900/60 border-slate-800 shadow-lg shadow-blue-500/5"
                            : "bg-transparent border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <button
                          onClick={() => setActiveAccordion(isOpen ? null : idx)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className="font-display font-semibold text-white tracking-tight">
                            {factor.title}
                          </span>
                          <ChevronRight
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                              isOpen ? "rotate-90 text-blue-400" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed pt-1 border-t border-slate-850">
                                {factor.desc}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right Column - Bento Stat dashboard with stagger container */}
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                
                {/* Stat 1 */}
                <motion.div variants={fadeInUpItem} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between min-h-[160px] shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-white tracking-tight">
                      <Counter value={97} suffix="%" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-2">
                      Client retention rate
                    </div>
                  </div>
                </motion.div>

                {/* Stat 2 */}
                <motion.div variants={fadeInUpItem} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between min-h-[160px] shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-white tracking-tight">
                      <Counter value={4.6} decimals={1} suffix="x" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-2">
                      Average ROAS uplift
                    </div>
                  </div>
                </motion.div>

                {/* Stat 3 */}
                <motion.div variants={fadeInUpItem} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between min-h-[160px] shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-white tracking-tight">
                      <Counter value={3} suffix=" hrs" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-2">
                      Average response time
                    </div>
                  </div>
                </motion.div>

                {/* Stat 4 */}
                <motion.div variants={fadeInUpItem} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between min-h-[160px] shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-white tracking-tight">
                      <Counter value={10} suffix="+" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-2">
                      Industries served
                    </div>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </div>
        </Scroll3DSection>

        {/* 9. CONTACT SECTION */}
        <Scroll3DSection id="contact">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-850 p-8 md:p-12 lg:p-16">
              
              {/* Abs glowing gradient background accent */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10"
              >
                
                {/* Left Side Content Info */}
                <motion.div variants={fadeInUpItem} className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Let's connect
                    </div>
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-4 tracking-tight leading-tight">
                      Tell us where you want your growth coordinates to go.
                    </h2>
                    <p className="text-slate-400 mt-4 leading-relaxed text-sm md:text-base">
                      Send a message or reach us directly — our Sydney team coordinates response times instantly and assigns our global developers or planners.
                    </p>
                  </div>

                  <div className="mt-10 lg:mt-0 flex flex-col items-start gap-4">
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-blue-500 hover:bg-slate-900 text-sm font-mono text-white transition-all duration-300 cursor-pointer shadow-lg w-full sm:w-auto"
                    >
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>info@digitalitmove.com</span>
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400 ml-auto sm:ml-2 animate-pulse" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500 hover:text-slate-300 ml-auto sm:ml-2" />
                      )}
                    </button>
                    
                    <span
                      className={`text-xs text-blue-400 transition-opacity duration-300 pl-1 ${
                        copied ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Copied email successfully!
                    </span>
                  </div>
                </motion.div>

                {/* Right Side - Interactive Form */}
                <motion.div variants={fadeInUpItem} className="lg:col-span-7">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-mono mb-1.5 font-medium">Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 font-mono mb-1.5 font-medium">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="name@company.com"
                          className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-mono mb-1.5 font-medium">Company (Optional)</label>
                      <input
                        type="text"
                        name="company"
                        value={formState.company}
                        onChange={handleInputChange}
                        placeholder="Your organization name"
                        className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-400 font-mono mb-1.5 font-medium">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder="What are your marketing coordinates?"
                        className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10 cursor-pointer text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    
                    <div className="text-[11px] text-slate-500 leading-relaxed mt-1 text-center sm:text-left">
                      By submitting, this automatically targets info@digitalitmove.com address.
                    </div>
                  </form>
                </motion.div>

              </motion.div>

            </div>
          </div>
        </Scroll3DSection>
      </main>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-white/5 border border-slate-850 flex items-center justify-center shadow-md`}>
                <svg className={`w-4 h-4 ${accentColorText}`} viewBox="0 0 100 100" fill="none">
                  <path d="M30 20 L75 50 L30 80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Digital <span className={accentColorText}>IT</span> Move
              </span>
            </div>

            <ul className="flex flex-wrap gap-6 md:gap-8 list-none m-0 p-0 justify-center">
              {["services", "process", "global", "contact"].map((sec) => (
                <li key={sec}>
                  <a
                    href={`#${sec}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider capitalize"
                  >
                    {sec === "global" ? "Global offices" : sec}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-500 font-mono">
            <span>© {new Date().getFullYear()} Digital IT Move. All rights reserved.</span>
            <span>Sydney, Australia · India · Dubai</span>
          </div>
        </div>
      </footer>

      {/* 11. CREATIVE UI CUSTOMIZER CONTROL DESK */}
      <div className="fixed bottom-6 left-6 z-50 font-sans">
        <AnimatePresence>
          {!isControlDeskOpen ? (
            <motion.button
              layoutId="controlDesk"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsControlDeskOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900/95 border border-slate-850 text-xs font-semibold uppercase tracking-wider text-white shadow-xl backdrop-blur-md cursor-pointer hover:border-slate-700 hover:translate-y-[-2px] transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeDot} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeDot}`}></span>
              </span>
              <span>🎨 Configure UI & Particles</span>
            </motion.button>
          ) : (
            <motion.div
              layoutId="controlDesk"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-[310px] sm:w-[340px] rounded-3xl bg-slate-950/98 border border-slate-800 p-5 shadow-2xl backdrop-blur-lg text-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${brandIconBg}`}>
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l.711 2.844-4.238 1.412a1.5 1.5 0 01-1.921-.96l-1.412-4.238 2.844.711M21 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs tracking-tight text-white leading-none">Creative Studio</h4>
                    <span className="text-[9px] text-slate-500 font-mono">Workspace Selector</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsControlDeskOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Theme presets */}
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">1. Select Visual Theme Accent</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "cosmic", label: "Cosmic Ocean", dot: "bg-blue-500", desc: "Digital Blue & Purple" },
                      { id: "solar", label: "Solar Flare", dot: "bg-amber-500", desc: "Energetic Amber" },
                      { id: "cyberpunk", label: "Cyber Neon", dot: "bg-pink-500", desc: "Electric Pink & Cyan" },
                      { id: "emerald", label: "Matrix Emerald", dot: "bg-emerald-500", desc: "Premium Mint Teal" }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setThemePreset(theme.id as any)}
                        className={`flex flex-col items-start p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          themePreset === theme.id
                            ? "bg-slate-900 border-slate-700/80 shadow-md"
                            : "bg-slate-900/20 border-transparent hover:border-slate-850 hover:bg-slate-900/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                          <span className="text-[11px] font-bold text-white">{theme.label}</span>
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 block">{theme.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Particle density */}
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">2. Fluid Particle Density</span>
                  <div className="flex gap-2 bg-slate-905 p-1 rounded-xl border border-slate-850">
                    {[
                      { id: "low", label: "Low", desc: "60 particles" },
                      { id: "medium", label: "Medium", desc: "140 particles" },
                      { id: "high", label: "High", desc: "260 particles" }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDensity(d.id as any)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                          density === d.id
                            ? "bg-slate-850 text-white shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-850/30"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed Multiplier */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">3. Drifting Velocity</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-300">{speedMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[7px] text-slate-600 font-mono mt-0.5">
                    <span>Zen (0.2x)</span>
                    <span>Standard (1.0x)</span>
                    <span>Quantum (2.5x)</span>
                  </div>
                </div>

                {/* Connection Line Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-850/60">
                  <div>
                    <span className="text-[11px] font-bold text-white block">Interconnected Nodes</span>
                    <span className="text-[9px] text-slate-500 font-mono">Render network lines between particles</span>
                  </div>
                  <button
                    onClick={() => setShowLines(!showLines)}
                    className={`w-9 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                      showLines ? badgeDot : "bg-slate-800"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        showLines ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Diagnostics Live Telemetry */}
                <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-850 mt-1">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-0.5 mb-1">
                    <span className="text-[8px] font-mono text-slate-500 uppercase">Live Workspace Engine State</span>
                    <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[8px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-600">PRESET:</span>
                      <span className="text-white uppercase">{themePreset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">FPS_CAP:</span>
                      <span className="text-white">60_V_SYNC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">PARTICLES:</span>
                      <span className="text-white">{density === "low" ? "60" : density === "high" ? "260" : "140"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">LINK_MAX:</span>
                      <span className="text-white">{density === "low" ? "75px" : density === "high" ? "115px" : "95px"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 12. BACK TO TOP SCROLL BUTTON */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center cursor-pointer shadow-lg hover:border-transparent transition-colors ${
              themePreset === "cosmic"
                ? "hover:bg-blue-600"
                : themePreset === "solar"
                ? "hover:bg-amber-600"
                : themePreset === "cyberpunk"
                ? "hover:bg-pink-600"
                : "hover:bg-emerald-600"
            }`}
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Beautiful Modal success notification after submitting */}
      <AnimatePresence>
        {formSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                Enquiry Routed Successfully
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mt-3">
                Thanks, <span className="text-white font-semibold">{formState.name}</span>! 
                We have generated your query ticket. If your system email client is active, it has opened a drafts composer addressed to <span className="text-blue-400">info@digitalitmove.com</span>. 
                Our Australian planning desk will follow up shortly.
              </p>
              <button
                onClick={() => {
                  setFormSuccess(false);
                  setFormState({ name: "", email: "", company: "", message: "" });
                }}
                className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 transition-colors text-white rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-blue-500/10"
              >
                Return to home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
