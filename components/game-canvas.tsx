"use client"

import { useEffect, useRef, useState } from "react"
import { Player, Obstacle, Food } from "@/lib/game-objects"
import { checkCollision } from "@/lib/collision"
import { useGameLoop } from "@/lib/use-game-loop"
import { useKeyPress } from "@/lib/use-key-press"

// Game constants
const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 600
const PLAYER_SIZE = 15 // Increased size for better visibility with images
const CIRCLE_RADIUS = 15 // Increased size for better visibility with images
const FOOD_RADIUS = 15 // Separate size for food
const PLAYER_SPEED = 5
const CIRCLE_SPEED = 3

// Adjusted timing constants for slower obstacle spawning
const CIRCLE_SPAWN_DELAY_INITIAL = 5000
const CIRCLE_SPAWN_DELAY_MIN = 1500
const SPAWN_RATE_DECREASE = 50
const MAX_CIRCLES = 100

// Image paths - replace these with your actual image paths
const PLAYER_IMAGE_PATH = "/player.png" // Example: "/images/player.png"
const OBSTACLE_IMAGE_PATH = "/obstacle.png" // Example: "/images/obstacle.png"
const FOOD_IMAGE_PATH = "food.png" // Example: "/images/food.png"

interface GameCanvasProps {
  onGameOver: (score: number) => void
}

export default function GameCanvas({ onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [food, setFood] = useState<Food | null>(null)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [nextSpawnTime, setNextSpawnTime] = useState(Date.now() + CIRCLE_SPAWN_DELAY_INITIAL)
  const [currentSpawnDelay, setCurrentSpawnDelay] = useState(CIRCLE_SPAWN_DELAY_INITIAL)
  const [gameTime, setGameTime] = useState(0)
  const [images, setImages] = useState<{
    player: HTMLImageElement | null
    obstacle: HTMLImageElement | null
    food: HTMLImageElement | null
  }>({
    player: null,
    obstacle: null,
    food: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load images
  useEffect(() => {
    const playerImg = new Image()
    const obstacleImg = new Image()
    const foodImg = new Image()

    let loadedCount = 0
    const totalImages = 3

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImages({
          player: playerImg,
          obstacle: obstacleImg,
          food: foodImg,
        })
        setIsLoading(false)
      }
    }

    playerImg.onload = checkAllLoaded
    obstacleImg.onload = checkAllLoaded
    foodImg.onload = checkAllLoaded

    // Handle loading errors
    const handleError = () => {
      console.error("Failed to load image")
      checkAllLoaded() // Still count it as loaded to avoid blocking the game
    }

    playerImg.onerror = handleError
    obstacleImg.onerror = handleError
    foodImg.onerror = handleError

    // Set crossOrigin to avoid CORS issues with canvas
    playerImg.crossOrigin = "anonymous"
    obstacleImg.crossOrigin = "anonymous"
    foodImg.crossOrigin = "anonymous"

    // Start loading the images
    playerImg.src = PLAYER_IMAGE_PATH
    obstacleImg.src = OBSTACLE_IMAGE_PATH
    foodImg.src = FOOD_IMAGE_PATH
  }, [])

  // Initialize game objects
  useEffect(() => {
    if (!canvasRef.current || isLoading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = SCREEN_WIDTH
    canvas.height = SCREEN_HEIGHT

    // Create player
    const newPlayer = new Player(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, PLAYER_SIZE, "blue", images.player)
    setPlayer(newPlayer)

    // Create initial food
    spawnFood()

    // Create initial obstacle - but with a delay
    setTimeout(() => {
      spawnObstacle()
    }, 2000) // Wait 2 seconds before spawning the first obstacle

    // Handle window resize
    const handleResize = () => {
      canvas.width = SCREEN_WIDTH
      canvas.height = SCREEN_HEIGHT
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isLoading, images])

  // Keyboard controls
  const arrowUp = useKeyPress("ArrowUp")
  const arrowDown = useKeyPress("ArrowDown")
  const arrowLeft = useKeyPress("ArrowLeft")
  const arrowRight = useKeyPress("ArrowRight")

  // Spawn a new obstacle
  const spawnObstacle = () => {
    if (!images.obstacle) return

    const isHorizontal = Math.random() < 0.5
    let x, y, speedX, speedY

    if (isHorizontal) {
      // Spawn on left or right edge
      x = Math.random() < 0.5 ? CIRCLE_RADIUS : SCREEN_WIDTH - CIRCLE_RADIUS
      y = Math.random() * (SCREEN_HEIGHT - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS
      speedX = x === CIRCLE_RADIUS ? CIRCLE_SPEED : -CIRCLE_SPEED
      speedY = 0
    } else {
      // Spawn on top or bottom edge
      x = Math.random() * (SCREEN_WIDTH - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS
      y = Math.random() < 0.5 ? CIRCLE_RADIUS : SCREEN_HEIGHT - CIRCLE_RADIUS
      speedX = 0
      speedY = y === CIRCLE_RADIUS ? CIRCLE_SPEED : -CIRCLE_SPEED
    }

    const newObstacle = new Obstacle(x, y, CIRCLE_RADIUS, "red", speedX, speedY, images.obstacle)
    setObstacles((prev) => [...prev, newObstacle])
  }

  // Spawn food
  const spawnFood = () => {
    if (!images.food) return

    const padding = 30
    const x = padding + Math.random() * (SCREEN_WIDTH - 2 * padding)
    const y = padding + Math.random() * (SCREEN_HEIGHT - 2 * padding)

    const newFood = new Food(x, y, FOOD_RADIUS, "green", images.food)
    setFood(newFood)
  }

  // Game loop
  useGameLoop(() => {
    if (!canvasRef.current || !player || !food) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    // Update game time
    const currentTime = Date.now()
    const elapsedTime = Math.floor((currentTime - startTime) / 1000) // in seconds
    setGameTime(elapsedTime)

    // Update player position based on key presses
    if (arrowUp) player.y = Math.max(player.y - PLAYER_SPEED, player.radius)
    if (arrowDown) player.y = Math.min(player.y + PLAYER_SPEED, SCREEN_HEIGHT - player.radius)
    if (arrowLeft) player.x = Math.max(player.x - PLAYER_SPEED, player.radius)
    if (arrowRight) player.x = Math.min(player.x + PLAYER_SPEED, SCREEN_WIDTH - player.radius)

    // Update and draw obstacles
    const updatedObstacles = obstacles.map((obstacle) => {
      obstacle.update(SCREEN_WIDTH, SCREEN_HEIGHT)
      obstacle.draw(ctx)
      return obstacle
    })

    // Check for collisions with obstacles
    for (const obstacle of updatedObstacles) {
      if (checkCollision(player, obstacle)) {
        onGameOver(score + elapsedTime)
        return
      }
    }

    setObstacles(updatedObstacles)

    // Check for food collection
    if (checkCollision(player, food)) {
      setScore((prev) => prev + 5)
      spawnFood()
      spawnObstacle()
    }

    // Spawn new obstacles based on time, but with a slower rate
    // Gradually decrease spawn time
    const newSpawnDelay = Math.max(
      CIRCLE_SPAWN_DELAY_MIN,
      CIRCLE_SPAWN_DELAY_INITIAL - (elapsedTime / 20) * SPAWN_RATE_DECREASE, // Slower decrease (divided by 20 instead of 10)
    )

    if (currentTime >= nextSpawnTime && obstacles.length < MAX_CIRCLES) {
      spawnObstacle()
      setNextSpawnTime(currentTime + newSpawnDelay)
      setCurrentSpawnDelay(newSpawnDelay)
    }

    // Draw game objects
    player.draw(ctx)
    food.draw(ctx)

    // Draw score
    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.fillText(`Pontuação: ${score + elapsedTime} (Presentes: ${score} + Tempo: ${elapsedTime})`, 10, 30)
  })

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black text-white border border-gray-700 rounded">
        <p className="text-xl">Carregando imagens...</p>
      </div>
    )
  }

  return (
    <canvas ref={canvasRef} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} className="border border-gray-700 rounded" />
  )
}

