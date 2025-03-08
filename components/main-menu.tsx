"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { HighScore } from "@/lib/types"

interface MainMenuProps {
  onStartGame: () => void
  highScores: HighScore[]
}

export default function MainMenu({ onStartGame, highScores }: MainMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [showHighScores, setShowHighScores] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto bg-amber-50 rounded-lg p-6 border-4 border-amber-600">
      {!showInstructions && !showHighScores ? (
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4 bg-amber-200 rounded-full flex items-center justify-center">
            <img src="/placeholder.svg?height=100&width=100" alt="Jegue Rei Logo" className="w-24 h-24" />
          </div>

          <p className="text-center text-amber-800 mb-8">
            Bem-vindo ao Jegue Rei! Sobreviva o máximo que puder e colete presentes!
          </p>

          <div className="grid gap-4 w-full max-w-xs">
            <Button onClick={onStartGame} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg">
              Jogar
            </Button>

            <Button
              onClick={() => setShowInstructions(true)}
              variant="outline"
              className="border-amber-600 text-amber-800 hover:bg-amber-100"
            >
              Instruções
            </Button>

            <Button
              onClick={() => setShowHighScores(true)}
              variant="outline"
              className="border-amber-600 text-amber-800 hover:bg-amber-100"
            >
              Recordes
            </Button>
          </div>
        </div>
      ) : showInstructions ? (
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Instruções</h2>

          <ul className="list-disc pl-5 mb-6 space-y-2 text-amber-800">
            <li>Use as setas do teclado para mover o Jegue.</li>
            <li>Evite colidir com os círculos em movimento (pico-picos).</li>
            <li>Colete os presentes para aumentar sua pontuação.</li>
            <li>Cada presente coletado faz surgir um novo pico-pico.</li>
            <li>A dificuldade aumenta com o tempo.</li>
            <li>Sobreviva o máximo que puder!</li>
          </ul>

          <Button
            onClick={() => setShowInstructions(false)}
            className="bg-amber-600 hover:bg-amber-700 text-white self-center"
          >
            Voltar
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Recordes</h2>

          {highScores.length > 0 ? (
            <div className="mb-6 overflow-y-auto max-h-80">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-200">
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-right">Presentes</th>
                    <th className="p-2 text-right">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.map((score, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-amber-50" : "bg-amber-100"}>
                      <td className="p-2">{score.name}</td>
                      <td className="p-2 text-right">{score.score}</td>
                      <td className="p-2 text-right">{score.time}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-amber-800 mb-6">Nenhum recorde ainda. Seja o primeiro!</p>
          )}

          <Button
            onClick={() => setShowHighScores(false)}
            className="bg-amber-600 hover:bg-amber-700 text-white self-center"
          >
            Voltar
          </Button>
        </div>
      )}
    </div>
  )
}

