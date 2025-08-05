import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

class Firebase {
  app;
  db;
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }
  async getTopVybecircles(limit = 5) {
    const snapshot = await getDocs(collection(this.db, "vybecircles"));
    const circles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return circles
      .sort((a, b) => (b.users?.length || 0) - (a.users?.length || 0))
      .slice(0, limit);
  }

  async getTrendingKeywords(limit = 12) {
    const snapshot = await getDocs(collection(this.db, "posts"));
    const posts = snapshot.docs.map((doc) => doc.data().content || "");

    const wordCount = {};
    posts.forEach((text) => {
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .forEach((word) => {
          if (word.length > 3) wordCount[word] = (wordCount[word] || 0) + 1;
        });
    });

    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  async getRandomUsers(limit = 5) {
    const snapshot = await getDocs(collection(this.db, "users"));
    const allUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allUsers.sort(() => 0.5 - Math.random()).slice(0, limit);
  }
}

export default new Firebase();
