import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Music, Sparkles, Heart, Mail, Phone, ArrowUp, 
  ChevronRight, Menu, X, Search, Lock, Check, CheckCircle2, 
  MapPin, Volume2, VolumeX, Pause, Play, Download, User, 
  Calendar, Clock, ArrowUpRight, Compass, Eye, ShieldAlert,
  Send, Instagram, Twitter, HeartHandshake, Scissors
} from "lucide-react";

import ThreeCanvas from "./components/ThreeCanvas";
import ChatbotWidget from "./components/ChatbotWidget";
import ParallaxImage from "./components/ParallaxImage";
import SlidingHeroImages from "./components/SlidingHeroImages";
// @ts-ignore
import macarenaGraduation from "./assets/images/macarena_graduation_1783457542849.jpg";
import { BLOG_POSTS, MUSIC_RELEASES, BEAUTY_PRODUCTS, FASHION_LOOKS, PRICING_PLANS } from "./data";
import { BlogPost, MusicRelease, FashionLook, BeautyProduct } from "./types";
import { playAmbientSynth, stopAmbientSynth } from "./utils/audio";

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<"home" | "about" | "blog" | "music" | "beauty" | "fashion" | "premium" | "contact">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Membership state (allows testing premium content live!)
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  // Custom premium responsive toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Blog states
  const [blogSearch, setBlogSearch] = useState("");
  const [blogCategory, setBlogCategory] = useState<string>("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Music states
  const [playingTrack, setPlayingTrack] = useState<MusicRelease | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Beauty states
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>(["beauty-1", "beauty-4"]); // initial defaults
  const [beautyCategory, setBeautyCategory] = useState<string>("All");

  // Fashion states
  const [fashionSeason, setFashionSeason] = useState<string>("All");

  // Contact Form states
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Monitor scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Audio player with our ambient synthesizer
  const handleTogglePlayTrack = (track: MusicRelease) => {
    if (track.isPremiumOnly && !isPremiumUser) {
      setCurrentTab("premium");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (playingTrack?.id === track.id) {
      if (isAudioPlaying) {
        stopAmbientSynth();
        setIsAudioPlaying(false);
      } else {
        playAmbientSynth();
        setIsAudioPlaying(true);
      }
    } else {
      stopAmbientSynth();
      setPlayingTrack(track);
      playAmbientSynth();
      setIsAudioPlaying(true);
    }
  };

  const handleGlobalAudioToggle = () => {
    if (!playingTrack && MUSIC_RELEASES.length > 0) {
      handleTogglePlayTrack(MUSIC_RELEASES[0]);
      return;
    }
    if (playingTrack) {
      if (isAudioPlaying) {
        stopAmbientSynth();
        setIsAudioPlaying(false);
      } else {
        playAmbientSynth();
        setIsAudioPlaying(true);
      }
    }
  };

  // Subscribe to newsletter
  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    if (!subscribedEmails.includes(newsletterEmail)) {
      setSubscribedEmails((prev) => [...prev, newsletterEmail]);
    }
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setNewsletterSuccess(false);
    }, 4000);
  };

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  // Beauty Favorite Toggles
  const toggleFavoriteBeauty = (id: string) => {
    setFavoriteProducts((prev) => 
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Navigation click helper
  const navigateTo = (tab: any) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-soft-pink selection:text-brand-pink overflow-x-hidden relative">
      {/* Premium Banner */}
      <AnimatePresence>
        {!isPremiumUser && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-pastel-purple via-pastel-pink via-lavender to-pastel-pink text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/40 text-brand-purple"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-pink animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-semibold">Discover premium poetry, unreleased music demos, & fashion diaries.</span>
            <button 
              onClick={() => navigateTo("premium")} 
              className="underline text-brand-purple hover:text-violet-accent font-bold"
            >
              Unlock Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 bg-cream/75 backdrop-blur-md border-b border-white/30" id="main-header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigateTo("home")} 
            className="flex flex-col items-start text-left cursor-pointer group"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal group-hover:text-brand-purple transition-colors">
              Macarena Mantilla
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple/70 font-semibold">
              Content Creator
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-widest uppercase">
            {(["home", "about", "blog", "music", "beauty", "fashion", "premium", "contact"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => navigateTo(tab)}
                className={`relative py-2 px-1 hover:text-brand-purple transition-colors ${
                  currentTab === tab ? "text-brand-purple font-bold" : "text-slate-600"
                }`}
              >
                {tab}
                {currentTab === tab && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Call To Action */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={() => navigateTo("premium")}
              className={`text-xs uppercase tracking-widest px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm border ${
                isPremiumUser 
                  ? "bg-teal-50 text-teal-800 border-baby-teal" 
                  : "bg-charcoal text-white hover:bg-slate-800 border-charcoal hover:shadow"
              }`}
            >
              {isPremiumUser ? "✓ Premium Active" : "Join Premium"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-3 rounded-full hover:bg-slate-100 transition-colors text-charcoal min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-cream border-b border-slate-200 shadow-xl fixed top-20 left-0 right-0 z-30 py-6 px-6 space-y-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="grid grid-cols-2 gap-4">
              {(["home", "about", "blog", "music", "beauty", "fashion", "premium", "contact"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => navigateTo(tab)}
                  className={`text-center py-3.5 px-3 rounded-2xl text-xs font-semibold tracking-widest uppercase transition-all border min-h-[44px] ${
                    currentTab === tab 
                      ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white border-transparent font-bold shadow-md" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <button 
                onClick={() => navigateTo("premium")}
                className="w-full text-center text-xs uppercase tracking-widest bg-gradient-to-r from-brand-purple to-brand-pink text-white py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                {isPremiumUser ? "✓ Premium Active" : "Unlock Premium Member Access"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* VIEW: HOME */}
        {currentTab === "home" && (
          <div id="view-home">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-10 md:py-20 lg:py-24 bg-gradient-to-b from-pastel-purple/50 via-pastel-pink/30 via-cream to-cream">
              {/* Warm organic textured background sliding images */}
              <SlidingHeroImages />

              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
                {/* Hero Content */}
                <div className="space-y-8 text-center flex flex-col items-center">
                  <div className="inline-flex items-center space-x-2 bg-pink-50/85 border border-pink-100 px-3 py-1.5 rounded-full shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                    <span className="text-[10px] uppercase tracking-wider font-mono text-brand-purple font-bold">
                      Writing, Music, Beauty & Fashion
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1] max-w-2xl">
                    Curating the quiet <span className="text-brand-purple font-semibold italic">poetry</span> of everyday life.
                  </h1>

                  <p className="text-sm md:text-base text-slate-900 font-medium leading-relaxed max-w-xl text-center">
                    Welcome Girlies and friends of all paths! I am Macarena Mantilla. I believe writing, poetry, and storytelling are powerful vessels of self-reflection and mental well-being. Here, we cultivate an inspiring, gender-neutral sanctuary for journaling, slow literature, and healing—including a dedicated space supporting men's mental health, because vulnerability is a strength that belongs to everyone.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                    <button 
                       onClick={() => navigateTo("blog")}
                      className="bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:from-violet-accent hover:to-berry-pink text-xs uppercase tracking-widest px-8 py-4 rounded-full font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Explore the Blog <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                       onClick={() => navigateTo("premium")}
                      className="glass text-charcoal hover:text-brand-purple hover:border-soft-purple hover:bg-lavender text-xs uppercase tracking-widest px-8 py-4 rounded-full font-semibold transition-all border border-slate-300 shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Join Premium
                    </button>
                    <button 
                      onClick={() => navigateTo("contact")}
                      className="text-slate-600 hover:text-brand-purple text-xs uppercase tracking-widest font-semibold px-4 py-2 transition-colors"
                    >
                      Contact
                    </button>
                  </div>

                  {/* Newsletter Fast Signup */}
                  <div className="pt-6 border-t border-slate-200 w-full max-w-md flex flex-col items-center">
                    <p className="text-xs text-slate-500 font-mono mb-3">RECEIVE WEEKLY ESSAYS & SOUNDSCAPES</p>
                    <form onSubmit={handleSubscribeNewsletter} className="flex gap-2 w-full">
                      <input 
                        type="email" 
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="your.email@example.com" 
                        className="flex-grow bg-white border border-slate-300 rounded-full px-4 py-2.5 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-soft-purple text-charcoal min-h-[44px]"
                      />
                      <button 
                        type="submit"
                        className="bg-brand-purple text-white hover:bg-violet-accent rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow min-h-[44px]"
                      >
                        Subscribe
                      </button>
                    </form>
                    {newsletterSuccess && (
                      <p className="text-[11px] text-brand-purple font-medium mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Welcome to our inner circle, beautiful! Check your inbox soon.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Features Bento Grid */}
            <section className="py-16 bg-cream border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Curation, Prose & Creative Expression</h2>
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">inclusive writing, storytelling, and mental wellness for all</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Writing */}
                  <div 
                    onClick={() => navigateTo("blog")}
                    className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-soft-purple transition-all group cursor-pointer shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-lavender flex items-center justify-center text-brand-purple mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-2">Ethereal Prose</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Poetry, reflective journaling, and empowering essays tailored for creative souls, celebrating mental wellness and shared journeys.
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-purple mt-4 uppercase tracking-wider font-bold">
                      Read Essays <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Card 2: Music */}
                  <div 
                    onClick={() => navigateTo("music")}
                    className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-soft-pink transition-all group cursor-pointer shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-pastel-pink flex items-center justify-center text-brand-pink mb-6 group-hover:scale-110 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-2">Pastel Soundscapes</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Dreamy acoustic melodies, organic instrumentals, and synesthetic pop designed to soothe.
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-pink mt-4 uppercase tracking-wider font-bold">
                      Listen Now <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Card 3: Beauty */}
                  <div 
                    onClick={() => navigateTo("beauty")}
                    className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-brand-pink/30 transition-all group cursor-pointer shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-soft-pink/30 flex items-center justify-center text-berry-pink mb-6 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-2">Clean Glow</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Minimal hydration routines, calming products, and gentle editorial beauty curation.
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-berry-pink mt-4 uppercase tracking-wider font-bold">
                      See Routines <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Card 4: Fashion */}
                  <div 
                    onClick={() => navigateTo("fashion")}
                    className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-soft-purple/60 transition-all group cursor-pointer shadow-sm hover:shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-soft-purple/30 flex items-center justify-center text-violet-accent mb-6 group-hover:scale-110 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-2">Sustainable Style</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Artistic outfit pairing, seasonal style diaries, and finding timeless elegance in vintage fabrics.
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-accent mt-4 uppercase tracking-wider font-bold">
                      View Lookbook <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Highlight Banner: Men's Mental Health Matters */}
                  <div 
                    onClick={() => navigateTo("blog")}
                    className="col-span-1 md:col-span-2 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-purple/25 text-white border border-brand-purple/30 hover:border-brand-purple/50 transition-all group cursor-pointer shadow-lg hover:shadow-xl mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 max-w-2xl text-left">
                      <div className="inline-flex items-center space-x-2 bg-brand-purple/20 border border-brand-purple/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono text-soft-pink font-bold">
                        <Sparkles className="w-3 h-3 text-brand-pink" />
                        <span>Mental Health Matters</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Breaking the Silence: Supporting Men's Mental Health</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        In our creative sanctuary, we believe well-being knows no boundaries. Discover our dedicated journal series, guided writing prompts, and slow literature crafted specifically to support men's mental health, vulnerability, and mindful living.
                      </p>
                    </div>
                    <button className="bg-gradient-to-r from-brand-purple to-brand-pink hover:from-violet-accent hover:to-berry-pink text-white text-xs uppercase tracking-widest px-6 py-3.5 rounded-full font-bold transition-all shadow-md shrink-0">
                      Read Mental Health Series
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: ABOUT */}
        {currentTab === "about" && (
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20" id="view-about">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image side */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-2 border-2 border-dashed border-baby-blue rounded-[32px] max-w-md w-full">
                  <div className="overflow-hidden rounded-[24px] aspect-[4/5] bg-slate-100 shadow-lg">
                    <img 
                      src="https://gjoznmzw2bc0wpip.public.blob.vercel-storage.com/A7406416.jpg" 
                      alt="Macarena Mantilla Profile" 
                      className="w-full h-full object-cover hover:scale-[1.02] transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-5 -right-5 bg-white border border-slate-100 shadow-md p-4 rounded-2xl max-w-[180px] text-left">
                    <HeartHandshake className="w-5 h-5 text-brand-pink mb-1" />
                    <p className="font-serif text-xs font-bold text-charcoal">Global Community</p>
                    <p className="text-[10px] text-slate-400">Inspiring slow living & soft style.</p>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Behind the Aesthetic</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
                  Storytelling is the thread that binds our style.
                </h2>
                
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Meet Macarena Mantilla</p>
                
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    My journey started with a simple notebook and a second-hand acoustic guitar. To me, songwriting was a natural extension of poetry, and styling an outfit was just another way to compose a visual stanza. I found that the quiet grace of a clean, ceramide-moisturized face was the perfect canvas for creative expression.
                  </p>
                  <p>
                    Today, I cultivate a digital sanctuary where I share these interconnected passions. I write about poetry structures, synth frequency synesthesia, skincare barriers, and vintage fabric sourcing. Every piece of content is crafted to help you find art and calmness in the details of your everyday routine.
                  </p>
                  <p>
                    Whether you are here to read my weekend diaries, stream my raw vocal memos, or grab seasonal tailoring tips, I am incredibly honored to have you as part of this creative community.
                  </p>
                </div>

                {/* Focus Highlights */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand-purple" /> Writing & Essays
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">Lyrical reflections on art and life.</p>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-brand-pink" /> Music Release
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">Dreamy, fingerstyle lo-fi acoustics.</p>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-700" /> Glow Beauty
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">Simplifying skincare and soft palettes.</p>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-slate-700" /> Pure Fashion
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">Vintage layering and styled collection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: BLOG */}
        {currentTab === "blog" && (
          <div className="max-w-7xl mx-auto px-6 py-12" id="view-blog">
            {/* Header / Search bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
              <div className="text-left space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">The Creative Log</span>
                <h2 className="font-serif text-3xl font-bold">Essays, Reviews & Journals</h2>
                <p className="text-xs text-slate-500">Explore thoughts on slow lifestyle, poetry structures, and fashion curations.</p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search articles & tags..." 
                  className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-3 md:py-2.5 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-soft-purple text-charcoal shadow-inner min-h-[44px]"
                />
              </div>
            </div>

            {/* Categories & Premium filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-2">
                {["All", "Writing", "Music", "Beauty", "Fashion", "Lifestyle"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      blogCategory === cat 
                        ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-sm font-bold" 
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Premium filter toggle indicator */}
              <button 
                onClick={() => navigateTo("premium")}
                className={`text-xs px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 font-medium transition-all ${
                  isPremiumUser 
                    ? "bg-teal-50 text-teal-800 border-baby-teal" 
                    : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                }`}
              >
                {isPremiumUser ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Premium Unlocked</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-pink-500" />
                    <span>Get Premium Access</span>
                  </>
                )}
              </button>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.filter((post) => {
                const matchQuery = post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                                   post.summary.toLowerCase().includes(blogSearch.toLowerCase()) ||
                                   post.tags.some(t => t.toLowerCase().includes(blogSearch.toLowerCase()));
                const matchCat = blogCategory === "All" || post.category === blogCategory;
                return matchQuery && matchCat;
              }).map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <ParallaxImage 
                      src={post.image} 
                      alt={post.title} 
                      containerClassName="w-full h-full" 
                    />
                    
                    {/* Category Label */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold text-slate-800">
                      {post.category}
                    </div>

                    {/* Premium Tag */}
                    {post.isPremium && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold flex items-center gap-1 shadow">
                        <Lock className="w-2.5 h-2.5" /> Premium
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-brand-purple transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-50">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription Panel */}
            <div className="mt-16 bg-gradient-to-r from-pastel-purple via-cream via-pastel-pink to-pastel-purple p-8 md:p-12 rounded-[32px] border border-white/50 text-center max-w-4xl mx-auto space-y-6 shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Inner Circle Newsletter</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">Subscribe to receive exclusive beauty lists, music releases, & poetry</h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                Join our supportive global community of dreamers. Get raw styling breakdowns, weekend journals, and upcoming audio alerts directly in your inbox.
              </p>
              
              <form onSubmit={handleSubscribeNewsletter} className="max-w-md mx-auto flex gap-2">
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your.email@example.com" 
                  className="flex-grow bg-white border border-slate-300 rounded-full px-5 py-3.5 md:py-3 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal text-charcoal min-h-[44px]"
                />
                <button 
                  type="submit"
                  className="bg-charcoal text-white hover:bg-slate-800 rounded-full px-7 py-3.5 md:py-3 text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px]"
                >
                  Join Us
                </button>
              </form>
              {newsletterSuccess && (
                <p className="text-xs text-teal-700 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Welcome to our inner circle, beautiful! Check your inbox soon.
                </p>
              )}
            </div>

            {/* BLOG READ OVERLAY MODAL */}
            <AnimatePresence>
              {selectedPost && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-cream w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl border border-white/40 flex flex-col max-h-[90vh]"
                  >
                    {/* Header bar */}
                    <div className="p-4 bg-white/80 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                        Reading {selectedPost.category} Post
                      </span>
                      <button 
                        onClick={() => setSelectedPost(null)}
                        className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable container */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="relative aspect-[21/9] bg-slate-100">
                        <img 
                          src={selectedPost.image} 
                          alt={selectedPost.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
                      </div>

                      <div className="p-6 md:p-10 space-y-6 text-left relative">
                        {/* Meta tags */}
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                          <span className="bg-slate-200 text-slate-800 px-2.5 py-1 rounded-full">{selectedPost.category}</span>
                          <span>{selectedPost.date}</span>
                          <span>{selectedPost.readTime}</span>
                        </div>

                        <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-charcoal">
                          {selectedPost.title}
                        </h3>

                        {/* Article body */}
                        {selectedPost.isPremium && !isPremiumUser ? (
                          // Premium lock block
                          <div className="p-8 rounded-3xl bg-pink-50/75 border border-pink-200 text-center space-y-4">
                            <Lock className="w-8 h-8 text-pink-500 mx-auto animate-bounce" />
                            <h4 className="font-serif text-lg font-bold text-pink-800">This Essay is Exclusive for Premium Muses</h4>
                            <p className="text-xs text-pink-600 max-w-md mx-auto leading-relaxed">
                              Macarena shares her highly personal journals, vintage thrift lists, and songwriting demo layers solely with our premium members.
                            </p>
                            <button 
                              onClick={() => {
                                setSelectedPost(null);
                                navigateTo("premium");
                              }}
                              className="bg-charcoal text-white hover:bg-slate-800 text-xs uppercase tracking-widest px-6 py-3 rounded-full font-semibold transition-all shadow"
                            >
                              Unlock with Membership
                            </button>
                          </div>
                        ) : (
                          // Real body text
                          <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
                            <p className="font-medium text-slate-900 text-lg border-l-4 border-brand-purple pl-4 py-1 italic bg-lavender/30">
                              "{selectedPost.summary}"
                            </p>
                            <p className="whitespace-pre-line">{selectedPost.content}</p>
                            
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-xs text-slate-400 italic">Curated by Macarena Mantilla</span>
                              <button 
                                onClick={() => setSelectedPost(null)}
                                className="text-xs uppercase tracking-wider font-bold text-brand-purple hover:underline"
                              >
                                Close Article
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW: MUSIC */}
        {currentTab === "music" && (
          <div className="max-w-7xl mx-auto px-6 py-12" id="view-music">
            {/* Header */}
            <div className="text-left space-y-2 mb-12 pb-6 border-b border-slate-200">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Pastel Soundscapes</span>
              <h2 className="font-serif text-3xl font-bold">Acoustic Indie & Dreamy Ambient Pop</h2>
              <p className="text-xs text-slate-500">Listen to delicate fingerstyle loops, spoken poems, and synesthetic vocal tracks.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Interactive Audio Deck */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-6 relative overflow-hidden">
                  {/* Subtle decorative vinyl design */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full border border-slate-100/80 animate-spin" style={{ animationDuration: "12s" }} />

                  <span className="text-[9px] uppercase tracking-wider font-mono text-brand-purple font-bold bg-lavender px-2.5 py-1 rounded-full">
                    Aesthetic Audio Deck
                  </span>

                  {playingTrack ? (
                    <div className="space-y-6">
                      <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden shadow-md">
                        <img 
                          src={playingTrack.image} 
                          alt={playingTrack.title} 
                          className={`w-full h-full object-cover transition-all ${isAudioPlaying ? "scale-102" : ""}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{playingTrack.type}</span>
                        <h3 className="font-serif text-xl font-bold text-charcoal">{playingTrack.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{playingTrack.description}</p>
                      </div>

                      {/* Mock waveform indicator playing dynamically! */}
                      <div className="h-10 flex items-center justify-between gap-1 bg-lavender/40 px-3 py-1.5 rounded-xl border border-soft-purple/30">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={`w-1 rounded-full bg-brand-purple transition-all ${isAudioPlaying ? "animate-[pulse_1s_infinite_alternate]" : "h-1"}`}
                            style={{ 
                              height: isAudioPlaying ? `${Math.floor(Math.random() * 26) + 6}px` : "4px",
                              animationDelay: `${i * 50}ms`
                            }}
                          />
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => handleTogglePlayTrack(playingTrack)}
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:from-violet-accent hover:to-berry-pink flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                          aria-label="Toggle Play"
                        >
                          {isAudioPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                        </button>

                        <div className="text-right">
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Acoustic Audio Active</p>
                          <p className="text-xs font-mono text-brand-purple font-bold">{isAudioPlaying ? "Playing Live..." : "Paused"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <Music className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-500">No active track playing.</p>
                      <button 
                        onClick={() => handleTogglePlayTrack(MUSIC_RELEASES[0])}
                        className="bg-charcoal text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Start First Track
                      </button>
                    </div>
                  )}
                </div>

                {/* Upcoming Projects & News */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
                  <h3 className="font-serif text-lg font-bold">Studio Diaries & Upcoming Tour</h3>
                  <div className="space-y-3.5">
                    <div className="border-l-2 border-baby-teal pl-3 py-0.5">
                      <p className="text-[10px] font-mono text-slate-400">OCTOBER 2026</p>
                      <h4 className="text-xs font-bold text-charcoal">Autumn Solitude Acoustic Tour</h4>
                      <p className="text-[11px] text-slate-500">Intimate garden shows across seven cities. Tickets on sale in August.</p>
                    </div>
                    <div className="border-l-2 border-baby-blue pl-3 py-0.5">
                      <p className="text-[10px] font-mono text-slate-400">AUGUST 2026</p>
                      <h4 className="text-xs font-bold text-charcoal">Pre-order: Written in Pastel (Poetry Volume)</h4>
                      <p className="text-[11px] text-slate-500">My upcoming 120-page full hardcover visual poetry monograph.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Music Releases List */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="font-serif text-lg font-bold text-left mb-4">Releases Catalog</h3>
                
                <div className="space-y-4">
                  {MUSIC_RELEASES.map((track) => {
                    const isActive = playingTrack?.id === track.id;
                    const isLocked = track.isPremiumOnly && !isPremiumUser;

                    return (
                      <div 
                        key={track.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left ${
                          isActive 
                            ? "bg-lavender/60 border-soft-purple shadow-sm" 
                            : "bg-white hover:bg-slate-50/50 border-slate-100"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shadow-sm relative">
                            <img src={track.image} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {isLocked && (
                              <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center text-white">
                                <Lock className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                {track.type}
                              </span>
                              {track.isPremiumOnly && (
                                <span className="text-[9px] uppercase font-mono text-pink-600 bg-pink-50 px-2 py-0.5 rounded font-bold">
                                  Premium
                                </span>
                              )}
                            </div>
                            <h4 className={`font-serif text-base font-bold mt-1 ${isActive ? "text-brand-purple" : "text-charcoal"}`}>{track.title}</h4>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{track.releaseDate} • {track.duration}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isLocked ? (
                            <button 
                              onClick={() => navigateTo("premium")}
                              className="text-xs uppercase tracking-wider font-bold bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 px-4 py-2 rounded-full flex items-center gap-1"
                            >
                              <Lock className="w-3.5 h-3.5" /> Unlock
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleTogglePlayTrack(track)}
                              className={`text-xs uppercase tracking-wider font-semibold rounded-full px-5 py-2.5 flex items-center gap-1.5 transition-colors ${
                                isActive && isAudioPlaying 
                                  ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white" 
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              }`}
                            >
                              {isActive && isAudioPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" /> Playing
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" /> Play Track
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: BEAUTY */}
        {currentTab === "beauty" && (
          <div className="max-w-7xl mx-auto px-6 py-12" id="view-beauty">
            {/* Header */}
            <div className="text-left space-y-2 mb-10 pb-6 border-b border-slate-200">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Minimal Pastel Glow</span>
              <h2 className="font-serif text-3xl font-bold">Beauty Reviews & Holy Grails</h2>
              <p className="text-xs text-slate-500">My botanical skincare routines, organic product curations, and clean beauty tutorials.</p>
            </div>

            {/* Favorite Counter Ribbon */}
            <div className="bg-gradient-to-r from-pastel-pink via-cream to-pastel-purple p-4 rounded-2xl border border-pink-100/60 mb-10 text-left flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-charcoal">Your Saved Holy Grails</h4>
                  <p className="text-[10px] text-slate-500">You have favorited {favoriteProducts.length} items from Macarena's lists.</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-white px-3 py-1 rounded-full border border-slate-100 text-slate-600">
                {favoriteProducts.length} Saved
              </span>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {BEAUTY_PRODUCTS.map((prod) => {
                const isFav = favoriteProducts.includes(prod.id);

                return (
                  <div 
                    key={prod.id}
                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Rating badge */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-800">
                          ★ {prod.rating.toFixed(1)}
                        </div>

                        {/* Heart Button */}
                        <button 
                          onClick={() => toggleFavoriteBeauty(prod.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:bg-white active:scale-90 transition-all cursor-pointer"
                          aria-label="Save Favorite"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : "text-slate-400"}`} />
                        </button>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">{prod.brand} • {prod.category}</span>
                        <h4 className="font-serif text-base font-bold text-charcoal line-clamp-1">{prod.name}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          "{prod.reviewText}"
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <a 
                        href={prod.affiliateLink}
                        onClick={(e) => { e.preventDefault(); showToast("Beautiful! Affiliate link tracked securely (sample integration)."); }}
                        className="w-full block text-center text-[10px] uppercase tracking-wider font-semibold bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl transition-colors"
                      >
                        Shop Holy Grail
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Editorial Routine Tutorial Section */}
            <div className="mt-16 bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-square bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600" 
                  alt="Tutorial Routine" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:col-span-8 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-purple font-bold">Beauty Routine Editorial</span>
                <h3 className="font-serif text-2xl font-bold">The Slow Glow: A 4-Step Skincare Routine</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We often confuse abundance with quality. When I simplified my beauty routine to just four botanical steps, my skin's natural moisture barrier repaired itself. Here is the daily sequence I trust:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-charcoal font-mono">01 / Gentle Herbal Cleansing</h4>
                    <p className="text-[11px] text-slate-500">Green tea hydrosols dissolve oils without stripping natural sebum layers.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-charcoal font-mono">02 / Deep Hydration Lock</h4>
                    <p className="text-[11px] text-slate-500">Applying lightweight ceramide toner to damp skin prepares it for nourishment.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-charcoal font-mono">03 / Barrier Reinforcement</h4>
                    <p className="text-[11px] text-slate-500">Squalan-based moisturizers block pollutants while maintaining a velvety velvet touch.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-charcoal font-mono">04 / Mineral Screen Shield</h4>
                    <p className="text-[11px] text-slate-500">Broad-spectrum mineral SPF protects your skin architecture against early damage.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: FASHION */}
        {currentTab === "fashion" && (
          <div className="max-w-7xl mx-auto px-6 py-12" id="view-fashion">
            {/* Header */}
            <div className="text-left space-y-2 mb-10 pb-6 border-b border-slate-200">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Timeless Silhouettes</span>
              <h2 className="font-serif text-3xl font-bold">Outfit Inspiration & Lookbooks</h2>
              <p className="text-xs text-slate-500">Exploring fluid tailoring, vintage textile blends, and minimalist capsule layering.</p>
            </div>

            {/* Filter tags for Seasons */}
            <div className="flex justify-start gap-2 mb-10">
              {["All", "Spring", "Summer", "Autumn", "Winter"].map((season) => (
                <button
                  key={season}
                  onClick={() => setFashionSeason(season)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    fashionSeason === season 
                      ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-sm font-bold" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {season} {season !== "All" && "Collection"}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FASHION_LOOKS.filter(l => fashionSeason === "All" || l.season === fashionSeason).map((look) => (
                <div 
                  key={look.id}
                  className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-slate-100 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <img 
                    src={look.image} 
                    alt={look.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Season Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold text-slate-800">
                    {look.season}
                  </div>

                  {/* Elegant fade-in glass overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent pt-20 flex flex-col justify-end text-left opacity-90 group-hover:opacity-100 transition-opacity">
                    <h4 className="font-serif text-lg font-bold text-white mb-2">{look.title}</h4>
                    <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 mb-3">
                      {look.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {look.tags.map((tag) => (
                        <span key={tag} className="text-[9px] uppercase font-mono bg-white/20 text-white px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive style guide download */}
            <div className="mt-16 p-8 md:p-12 bg-lavender/40 rounded-[32px] border border-soft-purple/30 text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-purple font-bold">Complimentary Style Resource</span>
                <h3 className="font-serif text-2xl font-bold">Curating Your Capsule: VintageSourcing PDF</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A high-contrast 25-page editorial directory containing Macarena's secret thrift shop directories worldwide, fabric preservation checklists, and proportion templates.
                </p>
              </div>
              <button 
                onClick={() => showToast("Lovely! The Sourcing PDF is being compiled and downloaded (simulated).")}
                className="whitespace-nowrap bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:from-violet-accent hover:to-berry-pink text-xs uppercase tracking-widest px-8 py-4 rounded-full font-bold transition-all shadow hover:shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Capsule Guide
              </button>
            </div>
          </div>
        )}

        {/* VIEW: PREMIUM MEMBERSHIP */}
        {currentTab === "premium" && (
          <div className="max-w-7xl mx-auto px-6 py-12" id="view-premium">
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-brand-purple font-bold">Exclusive Sanctuary</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Join the Creative Muse Community</h2>
              <p className="text-xs text-slate-500">Uncover monthly poetry collections, unreleased tracks, and private lifestyle diaries.</p>
            </div>

            {/* If user is already premium, show unlocked confirmation! */}
            {isPremiumUser && (
              <div className="bg-teal-50 border border-baby-teal p-6 rounded-3xl max-w-2xl mx-auto mb-12 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto animate-bounce" />
                <h3 className="font-serif text-xl font-bold text-teal-900">Your Premium Membership is Active! ✨</h3>
                <p className="text-xs text-teal-700 leading-relaxed max-w-md mx-auto">
                  Thank you for supporting slow art, darling! You now have unrestricted access to all Premium essays on the Blog and acoustic demo files in the Music section.
                </p>
                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => navigateTo("blog")}
                    className="bg-charcoal text-white hover:bg-slate-800 text-xs uppercase tracking-widest px-6 py-3 rounded-full font-semibold transition-all"
                  >
                    Go Read Essays
                  </button>
                  <button 
                    onClick={() => setIsPremiumUser(false)}
                    className="bg-white hover:bg-slate-50 text-slate-600 text-xs uppercase tracking-widest px-6 py-3 rounded-full font-semibold transition-all border border-slate-200"
                  >
                    Reset Premium Test
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
              {PRICING_PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-[32px] p-8 border text-left flex flex-col justify-between transition-all relative ${
                    plan.isPopular 
                      ? "border-baby-teal shadow-md ring-2 ring-baby-teal/30 scale-102" 
                      : "border-slate-100 shadow-sm"
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-8 bg-gradient-to-r from-violet-accent to-berry-pink text-white text-[9px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full shadow-sm">
                      Most Beloved Tier
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-charcoal">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline space-x-1.5">
                      <span className="font-serif text-4xl font-extrabold text-charcoal">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-mono">/ {plan.period === "monthly" ? "month" : "year"}</span>
                    </div>

                    <ul className="space-y-3 pt-4 border-t border-slate-100">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start space-x-2.5 text-xs text-slate-600 leading-relaxed">
                          <Check className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => {
                        if (isPremiumUser) {
                          showToast("Your premium test profile is already active, beautiful!");
                          return;
                        }
                        setCheckoutPlan(plan.name);
                      }}
                      className={`w-full text-center text-xs uppercase tracking-widest py-3.5 rounded-full font-semibold transition-all ${
                        plan.isPopular 
                          ? "bg-slate-800 hover:bg-slate-700 text-white" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isPremiumUser ? "✓ Already Subscribed" : `Subscribe to ${plan.name}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Exclusive Perks list */}
            <div className="mt-16 bg-gradient-to-r from-pastel-purple via-cream to-pastel-pink p-8 rounded-[32px] border border-white/50 text-left max-w-4xl mx-auto">
              <h3 className="font-serif text-xl font-bold mb-6 text-center">Your Membership Perks at a Glance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-purple shadow-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-bold">Unreleased Notebooks</h4>
                  <p className="text-xs text-slate-500">Read unfinished drafts, raw poetry files, and weekly design mood boards.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-berry-pink shadow-sm">
                    <Music className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-bold">Early Demo Audio</h4>
                  <p className="text-xs text-slate-500">Listen to live-take cassette tapes, chord recordings, and background guide vocals.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-violet-accent shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-bold">Private Q&A Support</h4>
                  <p className="text-xs text-slate-500">Directly consult Macarena on skincare formulas, sewing questions, or lyric edits.</p>
                </div>
              </div>
            </div>

            {/* CHECKOUT MODAL DIALOG */}
            <AnimatePresence>
              {checkoutPlan && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-cream rounded-3xl p-6 md:p-8 w-full max-w-md border border-white/40 shadow-2xl text-left space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-700" /> Complete Membership Join
                      </h4>
                      <button 
                        onClick={() => setCheckoutPlan(null)}
                        className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                      <p className="text-xs text-slate-400 font-mono uppercase">Selected Subscription</p>
                      <h3 className="font-serif text-base font-bold text-charcoal">{checkoutPlan} Plan</h3>
                      <p className="text-xs text-slate-500">Simulating a beautiful Stripe/OAuth webhook checkout flow. Cleared instantly for preview testing.</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Test Payment Credentials</p>
                      <div className="p-3 bg-slate-100 rounded-xl text-xs space-y-1 text-slate-600">
                        <p>Card: <span className="font-mono font-bold">•••• •••• •••• 4242</span> (Test mode)</p>
                        <p>Charge Amount: <span className="font-bold">Instant free authorization</span></p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCheckoutPlan(null)}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-600 text-xs uppercase tracking-widest py-3 rounded-full font-semibold border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setIsPremiumUser(true);
                          setCheckoutPlan(null);
                          showToast("Hooray! Premium membership authorized successfully! All locked entries are now unlocked.");
                        }}
                        className="flex-grow bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase tracking-widest py-3 rounded-full font-semibold"
                      >
                        Authorize Payment
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW: CONTACT */}
        {currentTab === "contact" && (
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20" id="view-contact">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm text-left space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-purple font-bold">Collaborations & Inquiries</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold">Send Macarena a Gentle Message</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Have a collaboration concept, business inquiry, or want to write some guest poetry? Pitch below, and Macarena or her assistant will review it within 48 hours.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 bg-teal-50 border border-baby-teal rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto animate-bounce" />
                    <h4 className="font-serif text-base font-bold text-teal-900">Message Transmitted! 🌸</h4>
                    <p className="text-xs text-teal-700 leading-relaxed">
                      Thank you, {contactForm.name}. Your details have been captured securely. We have sent a confirmation message copy to your email address: <span className="font-bold">{contactForm.email}</span>.
                    </p>
                    <button 
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactForm({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="bg-charcoal text-white text-xs uppercase tracking-widest px-5 py-2.5 rounded-full font-semibold mt-2"
                    >
                      Write New Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your lovely name" 
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 md:py-3 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal text-charcoal min-h-[44px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your.email@example.com" 
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 md:py-3 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal text-charcoal min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Subject Theme</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Collaboration, Poetry feedback, Business inquiry..." 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 md:py-3 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal text-charcoal min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Lyrical Message</label>
                      <textarea 
                        rows={5}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Write your creative proposal here..." 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal text-charcoal"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase tracking-widest py-3.5 rounded-full font-semibold transition-all shadow flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" /> Transmit Message
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Contact Details & Map */}
              <div className="lg:col-span-5 space-y-6 text-left">
                {/* Cards */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <h3 className="font-serif text-lg font-bold">Contact Directory</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-brand-purple shadow-inner">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Primary Business Email</p>
                        <a href="mailto:businessmacarena@gmail.com" className="text-xs font-semibold hover:underline text-slate-700">
                          businessmacarena@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-brand-pink shadow-inner">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Direct Office Telephone</p>
                        <a href="tel:2508793703" className="text-xs font-semibold hover:underline text-slate-700">
                          250-879-3703
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-pastel-pink/50 flex items-center justify-center text-brand-pink shadow-inner">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Creative Headquarters</p>
                        <p className="text-xs font-semibold text-slate-700">
                          Vancouver, BC, Canada
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social media connections */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-mono text-slate-400 uppercase mb-3">FOLLOW MACARENA'S STYLING DIARIES</p>
                    <div className="flex gap-2">
                      <a 
                        href="https://www.instagram.com/macarenamantillas" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-600 hover:text-pink-600 flex items-center justify-center transition-all"
                        title="Instagram"
                      >
                        <Instagram className="w-4.5 h-4.5" />
                      </a>
                      <a 
                        href="https://x.com/macarenamantill" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 flex items-center justify-center transition-all"
                        title="X / Twitter"
                      >
                        <Twitter className="w-4.5 h-4.5" />
                      </a>
                      <a 
                        href="https://substack.com/@macarenamantilla" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-600 hover:text-amber-700 flex items-center justify-center transition-all"
                        title="Substack"
                      >
                        <BookOpen className="w-4.5 h-4.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Styled Google Map Placeholder */}
                <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm overflow-hidden h-60 relative flex flex-col justify-end">
                  {/* Styled canvas vector to represent coordinates mapping beautifully */}
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                    <svg className="w-full h-full opacity-40 text-baby-blue" viewBox="0 0 400 200" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M 0,100 Q 100,20 200,100 T 400,100 M 50,0 V 200 M 150,0 V 200 M 250,0 V 200 M 350,0 V 200" />
                      <circle cx="200" cy="100" r="16" className="fill-cyan-100/60 stroke-cyan-500 stroke-2 animate-ping" />
                      <circle cx="200" cy="100" r="6" className="fill-cyan-600 stroke-white stroke-2" />
                    </svg>
                  </div>
                  
                  {/* Gradient to darken the map */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent pointer-events-none" />

                  {/* Text details */}
                  <div className="relative z-10 p-2 text-white">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300">Live coordinates map placeholder</span>
                    <h4 className="font-serif text-sm font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" /> Vancouver Studio HQ
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800" id="main-footer">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Column 1: Brand statement */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent tracking-tight">Macarena Mantilla</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A premium and warm digital sanctuary where writing, acoustic soundscapes, clean beauty, and timeless fashion intertwine gracefully.
              </p>
              <div className="flex gap-2.5 pt-2">
                <a 
                  href="https://www.instagram.com/macarenamantillas" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-900/40 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com/macarenamantill" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-cyan-900/40 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
                  title="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://substack.com/@macarenamantilla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-900/40 text-slate-400 hover:text-amber-400 flex items-center justify-center transition-all"
                  title="Substack"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation links */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Site Directory</h4>
              <ul className="space-y-2 text-xs">
                {(["home", "about", "blog", "music"] as const).map((tab) => (
                  <li key={tab}>
                    <button onClick={() => navigateTo(tab)} className="hover:text-white transition-colors capitalize">
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Navigation links */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Content Channels</h4>
              <ul className="space-y-2 text-xs">
                {(["beauty", "fashion", "premium", "contact"] as const).map((tab) => (
                  <li key={tab}>
                    <button onClick={() => navigateTo(tab)} className="hover:text-white transition-colors capitalize">
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legals / Subscription */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-widest font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Legal Agreements</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => showToast("Simulated Privacy Policy. Your brand details are securely processed offline.")} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => showToast("Simulated Terms of Service. Crafted lovingly by iWebNext.")} className="hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>

          {/* Centered copyright notice */}
          <div className="pt-8 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Macarena Mantilla. All Rights Reserved.</p>
            <p>
              Developed by <a href="https://iwebnext.com" target="_blank" rel="noreferrer" className="hover:underline text-brand-pink font-bold">iWebNext</a>
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING CHATBOT COMPONENT */}
      <ChatbotWidget />

      {/* SCROLL TO TOP FLOATING BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 w-11 h-11 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-lg pointer-events-auto z-40 cursor-pointer active:scale-95 transition-all"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 md:left-1/2 md:-translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur border border-white/10 max-w-[90vw] md:max-w-md pointer-events-auto font-sans"
          >
            <Sparkles className="w-4 h-4 text-brand-pink shrink-0" />
            <p className="flex-grow text-left leading-relaxed">{toastMessage}</p>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-slate-400 hover:text-white font-bold px-1.5 py-1 min-w-[32px]"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
