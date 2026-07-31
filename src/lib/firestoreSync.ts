import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, getDocs
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { BlogPost, MusicRelease, BeautyProduct, FashionLook, SiteSettings, ContactMessage } from "../types";
import { BLOG_POSTS, MUSIC_RELEASES, BEAUTY_PRODUCTS, FASHION_LOOKS } from "../data";

// Subscribe to Blogs
export function subscribeBlogs(onUpdate: (blogs: BlogPost[]) => void) {
  const colRef = collection(db, "blogs");
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed initial data if collection is empty
      try {
        for (const post of BLOG_POSTS) {
          await setDoc(doc(db, "blogs", post.id), post);
        }
      } catch (err) {
        console.warn("Failed to seed initial blogs:", err);
      }
      onUpdate(BLOG_POSTS);
    } else {
      const items: BlogPost[] = snapshot.docs.map(doc => doc.data() as BlogPost);
      onUpdate(items);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "blogs");
  });
}

// Subscribe to Music
export function subscribeMusic(onUpdate: (music: MusicRelease[]) => void) {
  const colRef = collection(db, "music");
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      try {
        for (const track of MUSIC_RELEASES) {
          await setDoc(doc(db, "music", track.id), track);
        }
      } catch (err) {
        console.warn("Failed to seed initial music:", err);
      }
      onUpdate(MUSIC_RELEASES);
    } else {
      const items: MusicRelease[] = snapshot.docs.map(doc => doc.data() as MusicRelease);
      onUpdate(items);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "music");
  });
}

// Subscribe to Beauty
export function subscribeBeauty(onUpdate: (beauty: BeautyProduct[]) => void) {
  const colRef = collection(db, "beauty");
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      try {
        for (const prod of BEAUTY_PRODUCTS) {
          await setDoc(doc(db, "beauty", prod.id), prod);
        }
      } catch (err) {
        console.warn("Failed to seed initial beauty products:", err);
      }
      onUpdate(BEAUTY_PRODUCTS);
    } else {
      const items: BeautyProduct[] = snapshot.docs.map(doc => doc.data() as BeautyProduct);
      onUpdate(items);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "beauty");
  });
}

// Subscribe to Fashion
export function subscribeFashion(onUpdate: (fashion: FashionLook[]) => void) {
  const colRef = collection(db, "fashion");
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      try {
        for (const look of FASHION_LOOKS) {
          await setDoc(doc(db, "fashion", look.id), look);
        }
      } catch (err) {
        console.warn("Failed to seed initial fashion looks:", err);
      }
      onUpdate(FASHION_LOOKS);
    } else {
      const items: FashionLook[] = snapshot.docs.map(doc => doc.data() as FashionLook);
      onUpdate(items);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "fashion");
  });
}

// Subscribe to Settings
export function subscribeSettings(onUpdate: (settings: SiteSettings) => void) {
  const docRef = doc(db, "settings", "main");
  return onSnapshot(docRef, async (snapshot) => {
    if (!snapshot.exists()) {
      const defaultSettings: SiteSettings = {
        heroTitle: "Curating the quiet poetry of everyday life.",
        heroBio: "Welcome Girlies and friends of all paths! I am Macarena Mantilla. I believe writing, poetry, and storytelling are powerful vessels of self-reflection and mental well-being. Here, we cultivate an inspiring, gender-neutral sanctuary for journaling, slow literature, and healing—including a dedicated space supporting men's mental health, because vulnerability is a strength that belongs to everyone.",
        aboutText1: "My journey started with a simple notebook and a second-hand acoustic guitar. To me, songwriting was a natural extension of poetry, and styling an outfit was just another way to compose a visual stanza. I found that the quiet grace of a clean, ceramide-moisturized face was the perfect canvas for creative expression.",
        aboutText2: "Today, I cultivate a digital sanctuary where I share these interconnected passions. I write about poetry structures, synth frequency synesthesia, skincare barriers, and vintage fabric sourcing. Every piece of content is crafted to help you find art and calmness in the details of your everyday routine.",
        contactEmail: "businessmacarena@gmail.com",
        contactPhone: "250-879-3703"
      };
      try {
        await setDoc(docRef, defaultSettings);
      } catch (err) {
        console.warn("Failed to seed site settings:", err);
      }
      onUpdate(defaultSettings);
    } else {
      onUpdate(snapshot.data() as SiteSettings);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "settings/main");
  });
}

// Subscribe to Subscribers
export function subscribeSubscribers(onUpdate: (emails: string[]) => void) {
  const colRef = collection(db, "subscribers");
  return onSnapshot(colRef, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data().email as string).filter(Boolean);
    onUpdate(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "subscribers");
  });
}

// Subscribe to Messages
export function subscribeMessages(onUpdate: (messages: ContactMessage[]) => void) {
  const colRef = collection(db, "messages");
  return onSnapshot(colRef, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as ContactMessage);
    onUpdate(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, "messages");
  });
}

// Firestore Mutation Functions
export async function saveBlogToFirestore(blog: BlogPost) {
  try {
    await setDoc(doc(db, "blogs", blog.id), blog);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blogs/${blog.id}`);
  }
}

export async function deleteBlogFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "blogs", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blogs/${id}`);
  }
}

export async function saveMusicToFirestore(track: MusicRelease) {
  try {
    await setDoc(doc(db, "music", track.id), track);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `music/${track.id}`);
  }
}

export async function deleteMusicFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "music", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `music/${id}`);
  }
}

export async function saveBeautyToFirestore(prod: BeautyProduct) {
  try {
    await setDoc(doc(db, "beauty", prod.id), prod);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `beauty/${prod.id}`);
  }
}

export async function deleteBeautyFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "beauty", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `beauty/${id}`);
  }
}

export async function saveFashionToFirestore(look: FashionLook) {
  try {
    await setDoc(doc(db, "fashion", look.id), look);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `fashion/${look.id}`);
  }
}

export async function deleteFashionFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "fashion", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `fashion/${id}`);
  }
}

export async function saveSettingsToFirestore(settings: SiteSettings) {
  try {
    await setDoc(doc(db, "settings", "main"), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "settings/main");
  }
}

export async function addSubscriberToFirestore(email: string) {
  try {
    const subId = "sub-" + Date.now();
    await setDoc(doc(db, "subscribers", subId), {
      email,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "subscribers");
  }
}

export async function saveMessageToFirestore(msg: ContactMessage) {
  try {
    await setDoc(doc(db, "messages", msg.id), msg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `messages/${msg.id}`);
  }
}

export async function deleteMessageFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "messages", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
  }
}
