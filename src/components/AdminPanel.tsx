import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Trash2, Edit3, Lock, LogOut, Check, X, Image as ImageIcon, 
  Tag, FileText, Sparkles, Music, Heart, Scissors, ShieldCheck, 
  Settings, Users, MessageSquare, RefreshCw, Search, ArrowLeft,
  Calendar, Clock, Eye, ExternalLink, CheckCircle2, AlertCircle
} from "lucide-react";
import { BlogPost, MusicRelease, BeautyProduct, FashionLook, SiteSettings, ContactMessage } from "../types";

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onLogin: (email: string, pass: string) => boolean;
  onLogout: () => void;
  
  // Blog handlers
  blogs: BlogPost[];
  onAddBlog: (blog: Omit<BlogPost, "id">) => void;
  onEditBlog: (blog: BlogPost) => void;
  onDeleteBlog: (id: string) => void;

  // Music handlers
  music: MusicRelease[];
  onAddMusic: (track: Omit<MusicRelease, "id">) => void;
  onEditMusic: (track: MusicRelease) => void;
  onDeleteMusic: (id: string) => void;

  // Beauty handlers
  beauty: BeautyProduct[];
  onAddBeauty: (prod: Omit<BeautyProduct, "id">) => void;
  onEditBeauty: (prod: BeautyProduct) => void;
  onDeleteBeauty: (id: string) => void;

  // Fashion handlers
  fashion: FashionLook[];
  onAddFashion: (look: Omit<FashionLook, "id">) => void;
  onEditFashion: (look: FashionLook) => void;
  onDeleteFashion: (id: string) => void;

  // Settings
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;

  // Subscribers & Messages
  subscribers: string[];
  messages: ContactMessage[];
  onDeleteMessage: (id: string) => void;
  onResetData: () => void;

  // Navigation back to site
  onCloseAdmin: () => void;
  showToast: (msg: string) => void;
}

export default function AdminPanel({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  blogs,
  onAddBlog,
  onEditBlog,
  onDeleteBlog,
  music,
  onAddMusic,
  onEditMusic,
  onDeleteMusic,
  beauty,
  onAddBeauty,
  onEditBeauty,
  onDeleteBeauty,
  fashion,
  onAddFashion,
  onEditFashion,
  onDeleteFashion,
  settings,
  onUpdateSettings,
  subscribers,
  messages,
  onDeleteMessage,
  onResetData,
  onCloseAdmin,
  showToast
}: AdminPanelProps) {
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "blogs" | "music" | "beauty" | "fashion" | "settings" | "subscribers">("overview");

  // Search & Filters
  const [blogSearch, setBlogSearch] = useState("");

  // Modals State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [editingMusic, setEditingMusic] = useState<MusicRelease | null>(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  const [editingBeauty, setEditingBeauty] = useState<BeautyProduct | null>(null);
  const [isBeautyModalOpen, setIsBeautyModalOpen] = useState(false);

  const [editingFashion, setEditingFashion] = useState<FashionLook | null>(null);
  const [isFashionModalOpen, setIsFashionModalOpen] = useState(false);

  // Form State for Blog
  const [blogFormData, setBlogFormData] = useState<Omit<BlogPost, "id">>({
    title: "",
    summary: "",
    content: "",
    category: "Writing",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    tags: ["Poetry", "Essays"],
    isPremium: false
  });
  const [blogTagsInput, setBlogTagsInput] = useState("Poetry, Essays");

  // Form State for Music
  const [musicFormData, setMusicFormData] = useState<Omit<MusicRelease, "id">>({
    title: "",
    type: "Single",
    releaseDate: "July 2026",
    duration: "3:30",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
    audioUrl: "Acoustic vocals & soft synths",
    description: "",
    isPremiumOnly: false
  });

  // Form State for Beauty
  const [beautyFormData, setBeautyFormData] = useState<Omit<BeautyProduct, "id">>({
    name: "",
    brand: "",
    category: "Skincare",
    rating: 5,
    reviewText: "",
    affiliateLink: "#",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    isFavorite: true
  });

  // Form State for Fashion
  const [fashionFormData, setFashionFormData] = useState<Omit<FashionLook, "id">>({
    title: "",
    season: "Spring",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    description: "",
    tags: ["Minimalism", "Sustainable"]
  });
  const [fashionTagsInput, setFashionTagsInput] = useState("Minimalism, Sustainable");

  // Local site settings editing
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const success = onLogin(loginEmail, loginPassword);
    if (!success) {
      setLoginError("Invalid Email or Password. Please double check credentials.");
    } else {
      showToast("Welcome back, Macarena! Admin session active.");
    }
  };

  // Quick fill sample credentials button
  const autofillCredentials = () => {
    setLoginEmail("businessmacarena@gmail.com");
    setLoginPassword("Admin@2026");
    setLoginError("");
  };

  // OPEN BLOG MODAL
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogFormData({
      title: "",
      summary: "",
      content: "",
      category: "Writing",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
      tags: ["Writing", "Poetry"],
      isPremium: false
    });
    setBlogTagsInput("Writing, Poetry");
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      date: blog.date,
      readTime: blog.readTime,
      image: blog.image,
      tags: blog.tags,
      isPremium: blog.isPremium || false
    });
    setBlogTagsInput(blog.tags.join(", "));
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = blogTagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalData = { ...blogFormData, tags };

    if (editingBlog) {
      onEditBlog({ ...finalData, id: editingBlog.id });
      showToast("Blog post updated successfully!");
    } else {
      onAddBlog(finalData);
      showToast("New blog post published successfully!");
    }
    setIsBlogModalOpen(false);
  };

  // MUSIC MODAL
  const openNewMusicModal = () => {
    setEditingMusic(null);
    setMusicFormData({
      title: "",
      type: "Single",
      releaseDate: "July 2026",
      duration: "3:30",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
      audioUrl: "Dreamy acoustic soundscapes",
      description: "",
      isPremiumOnly: false
    });
    setIsMusicModalOpen(true);
  };

  const openEditMusicModal = (track: MusicRelease) => {
    setEditingMusic(track);
    setMusicFormData({
      title: track.title,
      type: track.type,
      releaseDate: track.releaseDate,
      duration: track.duration,
      image: track.image,
      audioUrl: track.audioUrl,
      description: track.description,
      isPremiumOnly: track.isPremiumOnly || false
    });
    setIsMusicModalOpen(true);
  };

  const handleSaveMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMusic) {
      onEditMusic({ ...musicFormData, id: editingMusic.id });
      showToast("Music release updated!");
    } else {
      onAddMusic(musicFormData);
      showToast("New track added to discography!");
    }
    setIsMusicModalOpen(false);
  };

  // BEAUTY MODAL
  const openNewBeautyModal = () => {
    setEditingBeauty(null);
    setBeautyFormData({
      name: "",
      brand: "",
      category: "Skincare",
      rating: 5,
      reviewText: "",
      affiliateLink: "#",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
      isFavorite: true
    });
    setIsBeautyModalOpen(true);
  };

  const openEditBeautyModal = (prod: BeautyProduct) => {
    setEditingBeauty(prod);
    setBeautyFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      rating: prod.rating,
      reviewText: prod.reviewText,
      affiliateLink: prod.affiliateLink,
      image: prod.image,
      isFavorite: prod.isFavorite
    });
    setIsBeautyModalOpen(true);
  };

  const handleSaveBeauty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBeauty) {
      onEditBeauty({ ...beautyFormData, id: editingBeauty.id });
      showToast("Beauty product entry updated!");
    } else {
      onAddBeauty(beautyFormData);
      showToast("New product added to Holy Grail list!");
    }
    setIsBeautyModalOpen(false);
  };

  // FASHION MODAL
  const openNewFashionModal = () => {
    setEditingFashion(null);
    setFashionFormData({
      title: "",
      season: "Spring",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
      description: "",
      tags: ["Minimalism", "Sustainable"]
    });
    setFashionTagsInput("Minimalism, Sustainable");
    setIsFashionModalOpen(true);
  };

  const openEditFashionModal = (look: FashionLook) => {
    setEditingFashion(look);
    setFashionFormData({
      title: look.title,
      season: look.season,
      image: look.image,
      description: look.description,
      tags: look.tags
    });
    setFashionTagsInput(look.tags.join(", "));
    setIsFashionModalOpen(true);
  };

  const handleSaveFashion = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = fashionTagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalData = { ...fashionFormData, tags };
    if (editingFashion) {
      onEditFashion({ ...finalData, id: editingFashion.id });
      showToast("Fashion look updated!");
    } else {
      onAddFashion(finalData);
      showToast("New style look added to lookbook!");
    }
    setIsFashionModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    showToast("Website settings and bio saved!");
  };

  // IF NOT LOGGED IN -> SHOW LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glowing background ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-purple/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide" style={{ color: '#ffffff' }}>
              Macarena Mantilla
            </h1>
            <p className="text-xs text-slate-200 mt-1 uppercase tracking-widest font-mono font-semibold" style={{ color: '#e2e8f0' }}>
              Admin Portal
            </p>
          </div>

          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-rose-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-slate-300 mb-1.5 font-semibold tracking-wider flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-brand-pink font-normal lowercase bg-brand-purple/20 px-2 py-0.5 rounded-md border border-brand-purple/30">admin account</span>
              </label>
              <input 
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full bg-slate-900/90 border border-slate-600/80 rounded-2xl px-4 py-3.5 text-sm text-white font-medium tracking-wide placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all shadow-inner hover:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-slate-400 mb-1.5 font-semibold">
                Password
              </label>
              <input 
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:brightness-110 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> Sign In To Admin Panel
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 flex flex-col gap-3 text-center">
            <button
              type="button"
              onClick={autofillCredentials}
              className="text-xs text-brand-pink hover:text-white transition-colors underline font-medium flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-fill Admin Credentials
            </button>
            <button
              type="button"
              onClick={onCloseAdmin}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN IS LOGGED IN -> FULL ADMIN DASHBOARD VIEW
  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
    b.category.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(blogSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-xl flex items-center justify-center shadow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span className="text-white" style={{ color: '#ffffff' }}>Macarena Mantilla</span> <span className="text-[10px] bg-brand-purple/30 text-brand-pink px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Admin</span>
            </h2>
            <p className="text-xs text-slate-200" style={{ color: '#e2e8f0' }}>Content Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-medium"
          >
            <Eye className="w-4 h-4" /> View Live Site
          </button>
          <button
            onClick={onLogout}
            className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 font-medium border border-rose-500/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "overview" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-4 h-4" /> Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === "blogs" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" /> Manage Blogs
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">{blogs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("music")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === "music" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4" /> Music Tracks
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">{music.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("beauty")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === "beauty" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" /> Holy Grail Beauty
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">{beauty.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("fashion")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === "fashion" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Scissors className="w-4 h-4" /> Fashion Looks
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">{fashion.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all ${
                activeTab === "settings" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Settings className="w-4 h-4" /> Site Content & Bio
            </button>

            <button
              onClick={() => setActiveTab("subscribers")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                activeTab === "subscribers" ? "bg-brand-purple text-white shadow" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Subscribers & Messages
              </div>
              <span className="text-[10px] bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full font-mono font-bold">{subscribers.length + messages.length}</span>
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2">
            <p className="text-[11px] text-slate-400">Database Options</p>
            <button
              onClick={() => {
                if (confirm("Reset website content back to initial sample defaults? This clears your custom edits.")) {
                  onResetData();
                  showToast("Website content restored to defaults.");
                }
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restore Default Data
            </button>
          </div>
        </aside>

        {/* Main Section Body */}
        <main className="flex-1 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 lg:p-8 min-h-[600px] overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-brand-purple/30 via-slate-900 to-brand-pink/20 border border-brand-purple/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>Welcome back, Macarena!</h3>
                  <p className="text-xs !text-white text-white mt-1 max-w-xl leading-relaxed font-medium" style={{ color: '#ffffff' }}>
                    You have complete control over your blog posts, music releases, beauty product recommendations, fashion lookbook, and welcome bio text right from this admin panel.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 uppercase font-mono">Blog Posts</span>
                    <FileText className="w-5 h-5 text-brand-purple" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{blogs.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Articles published</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 uppercase font-mono">Music Tracks</span>
                    <Music className="w-5 h-5 text-brand-pink" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{music.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Releases & demos</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 uppercase font-mono">Holy Grail</span>
                    <Heart className="w-5 h-5 text-rose-400" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{beauty.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Curated products</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 uppercase font-mono">Subscribers</span>
                    <Users className="w-5 h-5 text-baby-teal" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{subscribers.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Newsletter list</p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-xs font-mono uppercase !text-white text-white tracking-wider font-bold mb-4" style={{ color: '#ffffff' }}>Quick Content Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setActiveTab("blogs"); openNewBlogModal(); }}
                    className="bg-brand-purple hover:bg-violet-accent text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow"
                  >
                    <Plus className="w-4 h-4" /> Add New Blog Post
                  </button>
                  <button
                    onClick={() => { setActiveTab("music"); openNewMusicModal(); }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
                  >
                    <Plus className="w-4 h-4" /> Add Music Track
                  </button>
                  <button
                    onClick={() => { setActiveTab("beauty"); openNewBeautyModal(); }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
                  >
                    <Plus className="w-4 h-4" /> Add Beauty Recommendation
                  </button>
                  <button
                    onClick={() => { setActiveTab("settings"); }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
                  >
                    <Edit3 className="w-4 h-4" /> Update Website Bio
                  </button>
                </div>
              </div>

              {/* Recent Articles Table Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase !text-white text-white tracking-wider font-bold" style={{ color: '#ffffff' }}>Recent Published Articles</h4>
                  <button onClick={() => setActiveTab("blogs")} className="text-xs text-brand-pink hover:underline">View All</button>
                </div>
                <div className="space-y-2">
                  {blogs.slice(0, 4).map(post => (
                    <div key={post.id} className="bg-slate-800/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded-lg border border-slate-700 shrink-0" />
                        <div>
                          <h5 className="font-semibold text-sm !text-white text-white line-clamp-1" style={{ color: '#ffffff' }}>{post.title}</h5>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-brand-purple font-medium">{post.category}</span> • <span>{post.date}</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("blogs"); openEditBlogModal(post); }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOG MANAGEMENT */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>Blog & Poetry Management</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Add, edit, or delete articles, prose, and lifestyle entries.</p>
                </div>
                <button
                  onClick={openNewBlogModal}
                  className="bg-gradient-to-r from-brand-purple to-brand-pink text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow hover:brightness-110 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Create New Blog
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search blogs by title, category, or tags..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>

              {/* Blogs List */}
              <div className="space-y-3">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs bg-slate-800/30 rounded-2xl border border-slate-800">
                    No blogs found matching your search.
                  </div>
                ) : (
                  filteredBlogs.map((blog) => (
                    <div key={blog.id} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                      <div className="flex items-start sm:items-center gap-4">
                        <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded-xl border border-slate-700 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-brand-purple/20 text-brand-pink rounded-md">
                              {blog.category}
                            </span>
                            {blog.isPremium && (
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Premium
                              </span>
                            )}
                            <span className="text-xs text-slate-400">{blog.date}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold !text-white text-white mt-1" style={{ color: '#ffffff' }}>{blog.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{blog.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => openEditBlogModal(blog)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                              onDeleteBlog(blog.id);
                              showToast("Blog post deleted.");
                            }
                          }}
                          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MUSIC MANAGEMENT */}
          {activeTab === "music" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>Music & Soundscapes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage discography, singles, EPs, and audio demos.</p>
                </div>
                <button
                  onClick={openNewMusicModal}
                  className="bg-gradient-to-r from-brand-purple to-brand-pink text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Music Track
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {music.map(track => (
                  <div key={track.id} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex gap-4">
                    <img src={track.image} alt={track.title} className="w-20 h-20 object-cover rounded-xl border border-slate-700 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono font-bold bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-md">
                            {track.type}
                          </span>
                          <span className="text-xs text-slate-400">{track.releaseDate}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold !text-white text-white mt-1" style={{ color: '#ffffff' }}>{track.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{track.description}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => openEditMusicModal(track)}
                          className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete track "${track.title}"?`)) {
                              onDeleteMusic(track.id);
                              showToast("Track deleted.");
                            }
                          }}
                          className="text-xs text-rose-300 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BEAUTY MANAGEMENT */}
          {activeTab === "beauty" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Holy Grail Beauty Products</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage curated skincare, makeup, and fragrance recommendations.</p>
                </div>
                <button
                  onClick={openNewBeautyModal}
                  className="bg-gradient-to-r from-brand-purple to-brand-pink text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Recommendation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beauty.map(prod => (
                  <div key={prod.id} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex gap-4">
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-xl border border-slate-700 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{prod.brand}</span>
                          <span className="text-xs text-amber-400 font-bold">★ {prod.rating}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-white mt-0.5">{prod.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prod.reviewText}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => openEditBeautyModal(prod)}
                          className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete beauty item "${prod.name}"?`)) {
                              onDeleteBeauty(prod.id);
                              showToast("Product deleted.");
                            }
                          }}
                          className="text-xs text-rose-300 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FASHION LOOKS MANAGEMENT */}
          {activeTab === "fashion" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Fashion Lookbook</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage seasonal style guides and vintage outfits.</p>
                </div>
                <button
                  onClick={openNewFashionModal}
                  className="bg-gradient-to-r from-brand-purple to-brand-pink text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Fashion Look
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fashion.map(look => (
                  <div key={look.id} className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex gap-4">
                    <img src={look.image} alt={look.title} className="w-20 h-20 object-cover rounded-xl border border-slate-700 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold bg-brand-purple/20 text-brand-pink px-2 py-0.5 rounded-md">
                          {look.season}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white mt-1">{look.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{look.description}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => openEditFashionModal(look)}
                          className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete fashion look "${look.title}"?`)) {
                              onDeleteFashion(look.id);
                              showToast("Look deleted.");
                            }
                          }}
                          className="text-xs text-rose-300 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Website Hero & Bio Content</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize the intro headline, welcome paragraph, and contact info shown across the site.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 bg-slate-800/60 border border-slate-800 p-6 rounded-2xl">
                <div>
                  <label className="block text-xs uppercase font-mono text-slate-300 font-bold mb-1.5">Hero Headline Title</label>
                  <input 
                    type="text"
                    value={localSettings.heroTitle}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-slate-300 font-bold mb-1.5">Macarena's Intro Welcome Paragraph</label>
                  <textarea 
                    rows={4}
                    value={localSettings.heroBio}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroBio: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-slate-300 font-bold mb-1.5">Contact Email Address</label>
                    <input 
                      type="email"
                      value={localSettings.contactEmail}
                      onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono text-slate-300 font-bold mb-1.5">Contact Phone Number</label>
                    <input 
                      type="text"
                      value={localSettings.contactPhone}
                      onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-purple hover:bg-violet-accent text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Website Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: SUBSCRIBERS & MESSAGES */}
          {activeTab === "subscribers" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Subscribers & Inquiries</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage newsletter signups and view contact messages.</p>
              </div>

              {/* Newsletter list */}
              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-pink" /> Newsletter Subscribers ({subscribers.length})
                  </h4>
                </div>
                {subscribers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No subscribers yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subscribers.map((email, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                        {email}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Messages */}
              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-baby-teal" /> Received Contact Inquiries ({messages.length})
                </h4>
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No contact form submissions recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-white">{msg.name} ({msg.email})</span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                        </div>
                        <p className="text-xs font-semibold text-brand-pink">Subject: {msg.subject}</p>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg">{msg.message}</p>
                        <div className="text-right">
                          <button
                            onClick={() => onDeleteMessage(msg.id)}
                            className="text-[11px] text-rose-400 hover:underline"
                          >
                            Delete Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* BLOG MODAL */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
                <h3 className="font-serif text-xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>
                  {editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
                </h3>
                <button 
                  onClick={() => setIsBlogModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4 text-xs overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Article Title</label>
                  <input 
                    type="text"
                    required
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    placeholder="e.g. The Architecture of Silences..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Category</label>
                    <select
                      value={blogFormData.category}
                      onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="Writing">Writing</option>
                      <option value="Music">Music</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Publish Date</label>
                    <input 
                      type="text"
                      value={blogFormData.date}
                      onChange={(e) => setBlogFormData({ ...blogFormData, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Read Time</label>
                    <input 
                      type="text"
                      value={blogFormData.readTime}
                      onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Summary / Short Excerpt</label>
                  <textarea 
                    rows={2}
                    required
                    value={blogFormData.summary}
                    onChange={(e) => setBlogFormData({ ...blogFormData, summary: e.target.value })}
                    placeholder="A brief 2-sentence teaser for readers..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Full Article Content</label>
                  <textarea 
                    rows={5}
                    required
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    placeholder="Write your complete prose, poetry, or lifestyle thoughts here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      required
                      value={blogFormData.image}
                      onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                  {blogFormData.image && (
                    <div className="mt-2 flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <img src={blogFormData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                      <span className="text-[11px] text-slate-400">Image Preview Verified</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Tags (comma-separated)</label>
                  <input 
                    type="text"
                    value={blogTagsInput}
                    onChange={(e) => setBlogTagsInput(e.target.value)}
                    placeholder="Poetry, Creative Process, Essays"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isPremiumBlog"
                    checked={blogFormData.isPremium}
                    onChange={(e) => setBlogFormData({ ...blogFormData, isPremium: e.target.checked })}
                    className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                  />
                  <label htmlFor="isPremiumBlog" className="text-xs text-slate-200 cursor-pointer font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Restrict access to Premium Members only
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold uppercase tracking-wider shadow cursor-pointer"
                  >
                    {editingBlog ? "Save Article Changes" : "Publish Blog Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MUSIC MODAL */}
      <AnimatePresence>
        {isMusicModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
                <h3 className="font-serif text-xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>
                  {editingMusic ? "Edit Music Track" : "Add Music Track"}
                </h3>
                <button onClick={() => setIsMusicModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMusic} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Track Title</label>
                  <input 
                    type="text"
                    required
                    value={musicFormData.title}
                    onChange={(e) => setMusicFormData({ ...musicFormData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Release Type</label>
                    <select
                      value={musicFormData.type}
                      onChange={(e) => setMusicFormData({ ...musicFormData, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Single">Single</option>
                      <option value="EP">EP</option>
                      <option value="Album">Album</option>
                      <option value="Demo">Demo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Release Date</label>
                    <input 
                      type="text"
                      value={musicFormData.releaseDate}
                      onChange={(e) => setMusicFormData({ ...musicFormData, releaseDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Description</label>
                  <textarea 
                    rows={2}
                    value={musicFormData.description}
                    onChange={(e) => setMusicFormData({ ...musicFormData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Cover Art Image URL</label>
                  <input 
                    type="url"
                    required
                    value={musicFormData.image}
                    onChange={(e) => setMusicFormData({ ...musicFormData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900">
                  <button type="button" onClick={() => setIsMusicModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-brand-purple font-bold">Save Track</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BEAUTY MODAL */}
      <AnimatePresence>
        {isBeautyModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
                <h3 className="font-serif text-xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>
                  {editingBeauty ? "Edit Beauty Item" : "Add Beauty Item"}
                </h3>
                <button onClick={() => setIsBeautyModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBeauty} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Product Name</label>
                  <input 
                    type="text"
                    required
                    value={beautyFormData.name}
                    onChange={(e) => setBeautyFormData({ ...beautyFormData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Brand</label>
                    <input 
                      type="text"
                      required
                      value={beautyFormData.brand}
                      onChange={(e) => setBeautyFormData({ ...beautyFormData, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Category</label>
                    <select
                      value={beautyFormData.category}
                      onChange={(e) => setBeautyFormData({ ...beautyFormData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Hair">Hair</option>
                      <option value="Fragrance">Fragrance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Review / Recommendation</label>
                  <textarea 
                    rows={3}
                    required
                    value={beautyFormData.reviewText}
                    onChange={(e) => setBeautyFormData({ ...beautyFormData, reviewText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Product Image URL</label>
                  <input 
                    type="url"
                    required
                    value={beautyFormData.image}
                    onChange={(e) => setBeautyFormData({ ...beautyFormData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900">
                  <button type="button" onClick={() => setIsBeautyModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-brand-purple font-bold">Save Recommendation</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FASHION MODAL */}
      <AnimatePresence>
        {isFashionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
                <h3 className="font-serif text-xl font-bold !text-white text-white" style={{ color: '#ffffff' }}>
                  {editingFashion ? "Edit Fashion Look" : "Add Fashion Look"}
                </h3>
                <button onClick={() => setIsFashionModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFashion} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Look Title</label>
                  <input 
                    type="text"
                    required
                    value={fashionFormData.title}
                    onChange={(e) => setFashionFormData({ ...fashionFormData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Season</label>
                  <select
                    value={fashionFormData.season}
                    onChange={(e) => setFashionFormData({ ...fashionFormData, season: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                    <option value="Winter">Winter</option>
                    <option value="All">All Seasons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={fashionFormData.description}
                    onChange={(e) => setFashionFormData({ ...fashionFormData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1 font-bold">Look Image URL</label>
                  <input 
                    type="url"
                    required
                    value={fashionFormData.image}
                    onChange={(e) => setFashionFormData({ ...fashionFormData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900">
                  <button type="button" onClick={() => setIsFashionModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-brand-purple font-bold">Save Look</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
