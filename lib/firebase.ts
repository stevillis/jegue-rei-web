import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore"
import type { HighScore } from "./types"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// High scores functions
export async function getHighScores(limitCount = 10): Promise<HighScore[]> {
  try {
    const highScoresRef = collection(db, "highScores")
    const q = query(highScoresRef, orderBy("score", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const highScores: HighScore[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      highScores.push({
        id: doc.id,
        player_name: data.player_name,
        score: data.score,
        created_at: data.created_at,
      })
    })

    return highScores
  } catch (error) {
    console.error("Error getting high scores:", error)
    return []
  }
}

export async function saveHighScore(playerName: string, score: number): Promise<HighScore | null> {
  try {
    const highScoreData = {
      player_name: playerName,
      score: score,
      created_at: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, "highScores"), highScoreData)

    return {
      id: docRef.id,
      ...highScoreData,
    }
  } catch (error) {
    console.error("Error saving high score:", error)
    // Return a more detailed error message
    throw new Error(`Failed to save score: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

