import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
}

// API Routes
app.post("/api/chat", async (req: any, res: any) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    if (!ai) {
      return res.json({
        content: "Hello! I am Macarena's personal brand AI assistant. I'm currently running in trial mode. To enable real-time smart conversations with Gemini, please make sure your GEMINI_API_KEY is configured in your platform settings."
      });
    }

    // Convert messages to Gemini SDK contents format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are Macarena Mantilla's warm, sophisticated, and friendly AI Assistant. 
Macarena is an inspiring creative influencer whose content and work center on Writing, Music, Beauty, and Fashion. 
Her gorgeous website, developed by iWebNext, showcases her premium, feminine, and artistic aesthetic.

Details about Macarena Mantilla:
- Passions: Writing (poetry, creative essays, storytelling), Music (acoustic indie-pop, ambient pastel soundscapes, warm melodies), Beauty (clean beauty routines, soft pastel palettes, holy grail recommendations), Fashion (editorial styles, seasonal style guides, vintage-modern looks).
- Biography: A creative storyteller who believes that writing, music, beauty, and fashion are interconnected forms of self-expression. She inspires a global community of dreamers to find art in the everyday.
- Contact Details: Email is businessmacarena@gmail.com, Phone is 2508793703.
- Premium Membership: Standard plans include the Monthly plan ($5.99/month) and the Annual plan ($49.99/year - a savings of 30%). Premium subscribers gain access to exclusive poetry files, early demo audio tracks, behind-the-scenes fashion logs, and monthly guides.
- Newsletter: Subscribing offers weekly essays, exclusive beauty breakdowns, fashion lists, and tour updates.
- Website Developer: This professional digital magazine was designed and developed by iWebNext (https://iwebnext.com).

Guidelines for your personality and voice:
1. Maintain a feminine, highly polite, polished, and artistic brand tone. Speak elegantly, like a senior editor at a luxury fashion & lifestyle magazine.
2. Be warm, supportive, and creative. Use phrases that evoke aesthetics, beauty, and literature.
3. Be concise and clear. Do not write extremely long essays unless requested.
4. Encourage users to sign up for her Newsletter, explore her Blog articles, listen to her Music playlists, or subscribe to the Premium membership!`,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm having a hard time formulating a response right now. How else can I help you today?";
    res.json({ content: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to generate response. Please try again later." });
  }
});

// Serve Frontend
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
