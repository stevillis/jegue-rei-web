import type { GameObject } from "./game-objects"

export function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  const dx = obj1.x - obj2.x
  const dy = obj1.y - obj2.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  return distance < obj1.radius + obj2.radius
}

