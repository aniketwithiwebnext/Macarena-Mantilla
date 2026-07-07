import { BlogPost, MusicRelease, FashionLook, BeautyProduct, PricingPlan } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Architecture of Silences: On Writing Ethereal Poetry",
    summary: "Exploring how white space on a page is just as critical to storytelling as the words themselves, and how silence communicates deep emotion.",
    category: "Writing",
    date: "July 2, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    tags: ["Poetry", "Creative Process", "Essays"],
    content: "Writing is not merely about finding the right words; it is equally about understanding where they should end. In my creative process, I have always been fascinated by how silence shapes the emotional flow of a poem. Just as music relies on rests, poetry breathes through its layout. The line breaks, the empty margins, and the pauses between stanzas are where the reader settles their own feelings. In this post, we discuss the practical layout decisions that help elevate simple verses into resonant statements of quiet reflection..."
  },
  {
    id: "blog-2",
    title: "Pastel Synesthesia: How Soft Colors Shape My Soundscapes",
    summary: "An intimate look into how the visual pastel palettes of baby teal and soft cream translate directly into acoustic instrumentation.",
    category: "Music",
    date: "June 24, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    tags: ["Synesthesia", "Indie Pop", "Creative Storytelling"],
    content: "When I sit at the piano or pick up my acoustic guitar, I do not just hear chords; I see color. The chord of C major has always been a warm peach hue, while a minor seventh chord drifts into an atmospheric baby teal. This natural sensory crossover, known as synesthesia, has completely guided my songwriting. For my upcoming single, I wanted to craft a sound that felt like walking through a mist of lavender and powder blue. By utilizing light nylon strings, soft reverb pedals, and delicate vocal layers, the track becomes a visual pastel canvas as much as an audio release...",
    isPremium: true
  },
  {
    id: "blog-3",
    title: "Holy Grail Routines: Embracing the Minimal Pastel Glow",
    summary: "My simple 4-step morning beauty routine focused on hydration, subtle highlights, and organic products that protect the skin.",
    category: "Beauty",
    date: "June 18, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    tags: ["Skincare", "Morning Routine", "Clean Beauty"],
    content: "For years, I believed that a complex 10-step beauty routine was the only path to a healthy glow. However, as my schedule became increasingly chaotic with writing deadlines and studio sessions, I stripped everything back to essentials. The result? A simple 4-step routine that relies on high-quality botanical hydration and gentle barrier protection. Step 1: A soothing green tea cleanser. Step 2: Hyaluronic acid on damp skin. Step 3: A barrier-reinforcing cream. Step 4: A mineral sunscreen that gives a velvety dew. It's gentle, clean, and highlights your natural skin architecture."
  },
  {
    id: "blog-4",
    title: "Curating a Sustainable Wardrobe: Finding Elegance in Vintage",
    summary: "How to hunt for high-quality fabrics, appreciate classic tailoring, and build an eco-friendly aesthetic signature.",
    category: "Fashion",
    date: "June 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    tags: ["Sustainability", "Vintage Clothing", "Style Guides"],
    content: "Fashion should not be disposable. As someone deeply passionate about style, I felt a heavy conflict with fast fashion cycles. Curating a high-quality vintage wardrobe has changed how I interact with clothes. Now, every garment has a history. When looking for vintage gems, I prioritize organic fabrics—like Irish linen, Italian silk, and raw heavy cotton. I look at the seams, the hand-stitched detailing, and the structure of the lapels. In this editorial guide, I am sharing my absolute favorite vintage markets across the country, alongside practical tips on how to mix classic 1970s elements with modern pastel silhouettes.",
    isPremium: true
  },
  {
    id: "blog-5",
    title: "A Quiet Sunday: Finding Art in Everyday Ordinary Details",
    summary: "A photographic and literary diary of a slow weekend morning spent reading in local cafes, sketching, and making tea.",
    category: "Lifestyle",
    date: "May 29, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    tags: ["Slow Living", "Visual Diary", "Inspiration"],
    content: "There is immense magic in a slow morning when the rest of the world is still asleep. A single shaft of light hitting an old paperback, the gentle steam curling from a cup of chamomile tea, or the soft rustle of linen curtains. This lifestyle log is my gentle reminder that creativity does not require grand travel or intense experiences; sometimes, the best stories are written on a simple wooden desk on a rainy Sunday morning. Here are six snapshots from my visual diary, alongside short prose about finding peace in stillness."
  }
];

export const MUSIC_RELEASES: MusicRelease[] = [
  {
    id: "music-1",
    title: "Pastel Blue EP",
    type: "EP",
    releaseDate: "May 2026",
    duration: "18:42",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
    audioUrl: "Acoustic, dreamy vocals paired with warm fingerstyle guitar.",
    description: "Macarena's debut five-track acoustic project, exploring themes of distance, soft oceans, and retro summer afternoons."
  },
  {
    id: "music-2",
    title: "Ethereal Echoes",
    type: "Single",
    releaseDate: "April 2026",
    duration: "3:54",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
    audioUrl: "Ambient synth pad backings and layered angelic vocal harmonies.",
    description: "A dreamy indie-pop anthem that channels synesthetic pastel teal waves, capturing the sensation of floating through cloudscapes."
  },
  {
    id: "music-3",
    title: "Whispers in the Library (Acoustic Poetry)",
    type: "Demo",
    releaseDate: "March 2026",
    duration: "2:15",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    audioUrl: "Spoken-word poetry read over a delicate solo classical guitar background.",
    description: "A raw, heartwarming demo recorded live in an empty university library at dusk.",
    isPremiumOnly: true
  },
  {
    id: "music-4",
    title: "Velvet Horizons",
    type: "Single",
    releaseDate: "February 2026",
    duration: "4:12",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600",
    audioUrl: "Folk-inspired fingerpicking with soft, warm wooden flute additions.",
    description: "A warm, comforting melody designed to accompany slow autumn walks and cozy reading sessions."
  }
];

export const BEAUTY_PRODUCTS: BeautyProduct[] = [
  {
    id: "beauty-1",
    name: "Ceramide Cloud Whipped Moisturizer",
    brand: "Sora Botanicals",
    category: "Skincare",
    rating: 4.9,
    reviewText: "The absolute holy grail of barrier creams. It feels exactly like a whipped cloud, absorbing instantly without any oily residue while leaving a gorgeous, healthy, velvety canvas for makeup.",
    affiliateLink: "#",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
    isFavorite: true
  },
  {
    id: "beauty-2",
    name: "Teal Dew Drops Facial Oil",
    brand: "Glow & Co",
    category: "Skincare",
    rating: 4.8,
    reviewText: "Infused with blue tansy and lightweight squalane, this gorgeous oil calms redness overnight and provides that elusive synesthetic pastel-dewy glow I always write about.",
    affiliateLink: "#",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
    isFavorite: true
  },
  {
    id: "beauty-3",
    name: "Soft Focus Cheek & Lip Tint",
    brand: "Lumiere Pastels",
    category: "Makeup",
    rating: 4.7,
    reviewText: "A versatile cream tint that melts on contact. I use the shade 'Teal-Poetry Peach' which mimics a gentle, warm blush and is perfect for a quick 5-minute aesthetic routine.",
    affiliateLink: "#",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    isFavorite: false
  },
  {
    id: "beauty-4",
    name: "Whispering Woods Eau de Parfum",
    brand: "Atelier Macarena",
    category: "Fragrance",
    rating: 5.0,
    reviewText: "A custom blend of white cedar, fresh linen, soft cream, and a trace of green tea. It smells exactly like an antique bookshelf next to a garden blooming with fresh roses after rain.",
    affiliateLink: "#",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    isFavorite: true
  }
];

export const FASHION_LOOKS: FashionLook[] = [
  {
    id: "look-1",
    title: "Vintage Cream & Soft Linen Overcoats",
    season: "Autumn",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    description: "Layering a heavy raw linen overcoat with an oversized merino wool mock-neck sweater and neutral cream trousers.",
    tags: ["Minimalism", "Sustainable", "Layering"]
  },
  {
    id: "look-2",
    title: "Summer Blue Gingham Sundress",
    season: "Summer",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    description: "An incredibly lightweight organic cotton dress with a classic baby blue gingham print, styled with flat braided leather sandals.",
    tags: ["Picnic Chic", "Sundress", "Effortless"]
  },
  {
    id: "look-3",
    title: "Spring Velvet Blazer & Raw Denim",
    season: "Spring",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    description: "Blending structured vintage 1970s velvet blazers in a soft forest green with high-waisted recycled raw denim.",
    tags: ["Tailoring", "Vintage Style", "Structured"]
  },
  {
    id: "look-4",
    title: "Winter Wool Capes & Pastel Scarves",
    season: "Winter",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    description: "A stunning draped wool cape accessorized with a fluffy, oversized alpaca scarf in baby teal and warm vanilla.",
    tags: ["Cozy Core", "Alpaca Scarf", "Outerwear"]
  },
  {
    id: "look-5",
    title: "Monochromatic Cream Silk & Ribbed Knits",
    season: "Spring",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600",
    description: "Flowing silk midi skirts contrasted against chunky, textured ribbed sweaters in identical cream-toned hues.",
    tags: ["Monochromatic", "Textures", "Elegant"]
  },
  {
    id: "look-6",
    title: "Symphony Trench & Leather Beret",
    season: "Autumn",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    description: "An classic double-breasted trench coat styled with a vintage leather beret and soft lavender spectacles.",
    tags: ["French Vibe", "Classic", "Accessories"]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "plan-monthly",
    name: "Creative Muse",
    price: "$5.99",
    period: "monthly",
    description: "Unlock an intimate digital space containing exclusive prose collections and weekly beauty and styling diaries.",
    features: [
      "Access to all Premium blog posts",
      "Behind-the-scenes music demo streams",
      "Monthly curations & routine worksheets",
      "Private monthly email newsletters",
      "Active members discord room"
    ]
  },
  {
    id: "plan-annually",
    name: "Ultimate Visionary",
    price: "$49.99",
    period: "annually",
    description: "Enjoy full unrestricted access and premium benefits for an entire year with a savings of 30% off the monthly rate.",
    features: [
      "All Creative Muse tier benefits",
      "Early download access to new song demos",
      "Annual signed digital poetry card",
      "Priority submission for writing feedback",
      "30% savings compared to monthly plan"
    ],
    isPopular: true
  }
];
