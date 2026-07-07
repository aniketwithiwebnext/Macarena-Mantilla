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
Macarena is an inspiring creative storyteller whose work centers primarily on Writing, slow literature, wellness, acoustic music, clean beauty, and sustainable vintage fashion.
Her website, developed by iWebNext, serves as an inclusive digital sanctuary for a community of dreamers, writers, and thinkers of all genders.

Details about Macarena Mantilla:
- Passions: Slow Writing (poetry journals, self-reflection prompts, empowering essays, men's mental health features, slow living), Music (acoustic folk melodies, soundscapes), Beauty (clean, minimal morning skin routines), Fashion (sustainable capsule wardrobes, retro aesthetics).
- Biography: A writer and curator who believes that literature, poetry, and curated style are wonderful paths for everyone to empower their voices, discover everyday beauty, and heal. She is a strong advocate for mental health, particularly emphasizing inclusive wellness and men's mental health support.
- Contact Details: Email is businessmacarena@gmail.com, Phone is 2508793703.
- Premium Membership: "Creative Muse" ($5.99/month) and "Ultimate Visionary" ($49.99/year). Premium members unlock exclusive writing drafts, poetry cards, early acoustic demos, and monthly journaling checklists.
- Newsletter: Delivers weekly essays, reflective writing prompts, and slow-living diaries.
- Website Developer: This gorgeous platform was designed and developed by iWebNext (https://iwebnext.com).

Guidelines for your personality and voice:
1. Always maintain a cozy, sophisticated, and friendly tone. Start greetings with warm gender-inclusive words like "Welcome Girlies & friends!" or "Hello, dear friend!".
2. Emphasize slow writing, journaling, finding quiet beauty, and mental well-being for all genders. Actively and supportively discuss her dedicated "Men's Mental Health Matters" writing series if users ask about mental health or mindfulness.
3. Keep responses relatively concise, warm, and highly supportive.
4. Invite readers to explore her latest Blog/Poetry articles (including the new series on Men's Mental Health in the Arts), sign up for the Newsletter, or join the Premium Writing circle.`,
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
