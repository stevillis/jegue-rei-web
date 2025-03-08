"use client"

import { useState, useEffect } from "react"
import GameCanvas from "./game-canvas"
import { getHighScores, saveHighScore } from "@/lib/firebase"
import type { HighScore } from "@/lib/types"

type GameState = "menu" | "playing" | "gameOver"

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [playerName, setPlayerName] = useState("")
  const [currentScore, setCurrentScore] = useState(0)
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scoreSaved, setScoreSaved] = useState(false)

  // Load high scores from Firebase
  useEffect(() => {
    async function loadHighScores() {
      try {
        setIsLoading(true)
        const scores = await getHighScores()
        setHighScores(scores)
      } catch (err) {
        console.error("Failed to load high scores:", err)
        setError("Failed to load high scores. Using local storage as fallback.")

        // Fallback to localStorage
        const savedScores = localStorage.getItem("jegueReiHighScores")
        if (savedScores) {
          setHighScores(JSON.parse(savedScores))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadHighScores()
  }, [])

  const handleSaveScore = async (name: string, score: number) => {
    if (scoreSaved) return; // Prevent multiple saves

    try {
      // Try to save to Firebase
      const savedScore = await saveHighScore(name, score)
      if (savedScore) {
        // Refresh high scores
        const scores = await getHighScores()
        setHighScores(scores)
        setScoreSaved(true) // Mark as saved
        return true
      }
    } catch (err) {
      console.error("Failed to save score to database:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(`Failed to save score to database: ${errorMessage}. Using local storage as fallback.`)

      // Show the error for 5 seconds then clear it
      setTimeout(() => setError(null), 5000)
    }

    // Fallback to localStorage
    const newScore = { player_name: name, score }
    let currentScores = []

    try {
      const savedScores = localStorage.getItem("jegueReiHighScores")
      if (savedScores) {
        currentScores = JSON.parse(savedScores)
      }
    } catch (e) {
      console.error("Error parsing localStorage scores:", e)
    }

    const newHighScores = [...currentScores, newScore].sort((a, b) => b.score - a.score).slice(0, 10)

    setHighScores(newHighScores)
    localStorage.setItem("jegueReiHighScores", JSON.stringify(newHighScores))
    setScoreSaved(true) // Mark as saved even for localStorage
    return true
  }

  const handleGameOver = (score: number) => {
    setCurrentScore(score)
    setGameState("gameOver")
  }

  const startGame = () => {
    if (playerName) {
      setGameState("playing")
    }
  }

  const restartGame = () => {
    setGameState("menu")
    setCurrentScore(0)
    setScoreSaved(false)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-hidden">
      <h1 className="text-4xl font-bold my-4">Jegue Rei - O Jogo</h1>

      {error && <div className="bg-red-500 text-white p-2 mb-4 rounded max-w-md">{error}</div>}

      {/* Game states */}
      <div className="flex-1 w-full flex items-center justify-center">
        {gameState === "menu" && (
          <div className="text-center max-w-md w-full">
            <p className="mb-4">Tente pegar o presente e desviar dos martelos.</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite seu nome"
              className="mb-4 p-2 border rounded w-full text-black"
              maxLength={20}
            />
            <button
              onClick={startGame}
              disabled={!playerName}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 w-full"
            >
              Jogar
            </button>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">Top Jegues:</h2>
              {isLoading ? (
                <p>Carregando recordes...</p>
              ) : (
                <ul className="bg-gray-800 rounded p-2">
                  {highScores.length > 0 ? (
                    highScores.map((score, index) => (
                      <li key={index} className="py-1 border-b border-gray-700 last:border-0">
                        {index + 1}. {score.player_name}: {score.score} pts
                      </li>
                    ))
                  ) : (
                    <li>Nenhum recorde ainda. Seja o primeiro!</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {gameState === "playing" && <GameCanvas onGameOver={handleGameOver} playerName={playerName} />}

        {gameState === "gameOver" && (
          <div className="text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {playerName} fez {currentScore} pontos.
              <br />
              BOA, JEGUE!!!
            </h2>

            {/* Add save score button */}
            {playerName && (
              <button
                onClick={() => handleSaveScore(playerName, currentScore)}
                className="px-4 py-2 bg-green-500 text-white rounded w-full mb-4 disabled:opacity-50"
                disabled={scoreSaved}
              >
                {scoreSaved ? 'Pontuação salva!' : 'Salvar pontuação'}
              </button>
            )}

            <button onClick={restartGame} className="px-4 py-2 bg-blue-500 text-white rounded w-full mb-4">
              Jogar novamente
            </button>

            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">Top Jegues:</h2>
              {isLoading ? (
                <p>Carregando recordes...</p>
              ) : (
                <ul className="bg-gray-800 rounded p-2">
                  {highScores.map((score, index) => (
                    <li key={index} className="py-1 border-b border-gray-700 last:border-0">
                      {index + 1}. {score.player_name}: {score.score} pts
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

