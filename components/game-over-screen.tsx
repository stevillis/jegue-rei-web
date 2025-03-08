"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HighScore } from "@/lib/types"

interface GameOverScreenProps {
  score: number
  timeAlive: number
  onRestart: () => void
  onSaveScore: (name: string) => HighScore[]
  highScores: HighScore[]
}

export default function GameOverScreen({ score, timeAlive, onRestart, onSaveScore, highScores }: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState("")
  const [scoreSaved, setScoreSaved] = useState(false)
  const [updatedHighScores, setUpdatedHighScores] = useState<HighScore[]>(highScores)

  const handleSaveScore = () => {
    if (playerName.trim()) {
      const newHighScores = onSaveScore(playerName.trim())
      setUpdatedHighScores(newHighScores)
      setScoreSaved(true)
    }
  }

  const isHighScore = score > 0 && (highScores.length < 10 || score > (highScores[highScores.length - 1]?.score || 0))

  return (
    <div className="w-full max-w-2xl mx-auto bg-amber-50 rounded-lg p-6 border-4 border-amber-600">
      <h2 className="text-3xl font-bold text-amber-800 text-center mb-6">Fim de Jogo!</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-100 p-4 rounded-lg text-center">
          <p className="text-amber-800 text-sm">Presentes</p>
          <p className="text-3xl font-bold text-amber-800">{score}</p>
        </div>
        <div className="bg-amber-100 p-4 rounded-lg text-center">
          <p className="text-amber-800 text-sm">Tempo</p>
          <p className="text-3xl font-bold text-amber-800">{timeAlive}s</p>
        </div>
      </div>

      {isHighScore && !scoreSaved ? (
        <div className="mb-6 p-4 bg-amber-200 rounded-lg">
          <p className="text-amber-800 font-bold mb-2">Parabéns! Você fez um novo recorde!</p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Seu nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={15}
              className="border-amber-400 focus-visible:ring-amber-500"
            />
            <Button onClick={handleSaveScore} className="bg-amber-600 hover:bg-amber-700 text-white">
              Salvar
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-amber-800 mb-2">Melhores Pontuações</h3>
        <div className="max-h-40 overflow-y-auto bg-white rounded-lg">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-amber-200">
              <tr>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-right">Presentes</th>
                <th className="p-2 text-right">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {updatedHighScores.map((score, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-amber-50" : "bg-amber-100"} ${
                    !scoreSaved && playerName && score.name === playerName ? "bg-amber-300" : ""
                  }`}
                >
                  <td className="p-2">{score.name}</td>
                  <td className="p-2 text-right">{score.score}</td>
                  <td className="p-2 text-right">{score.time}s</td>
                </tr>
              ))}
              {updatedHighScores.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-2 text-center text-amber-800">
                    Nenhum recorde ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={onRestart} className="bg-amber-600 hover:bg-amber-700 text-white">
          Jogar novamente
        </Button>
      </div>
    </div>
  )
}

