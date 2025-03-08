class GameObject {
  x: number
  y: number
  radius: number
  color: string
  image: HTMLImageElement | null

  constructor(x: number, y: number, radius: number, color: string, image: HTMLImageElement | null = null) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.image = image
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      // Draw image centered on the object's position
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
    } else {
      // Fallback to circle if image is not available
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.closePath()
    }
  }
}

export class Player extends GameObject {
  constructor(x: number, y: number, radius: number, color: string, image: HTMLImageElement | null = null) {
    super(x, y, radius, color, image)
  }
}

export class Obstacle extends GameObject {
  speedX: number
  speedY: number
  rotation: number

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    speedX: number,
    speedY: number,
    image: HTMLImageElement | null = null,
  ) {
    super(x, y, radius, color, image)
    this.speedX = speedX
    this.speedY = speedY
    this.rotation = 0
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX
    this.y += this.speedY

    // Rotate the obstacle (only visible if using an image)
    this.rotation += 0.02

    // Bounce off the edges
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) {
      this.speedX = -this.speedX
      this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius))
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) {
      this.speedY = -this.speedY
      this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      // Save the current context state
      ctx.save()

      // Translate to the obstacle's position
      ctx.translate(this.x, this.y)

      // Rotate the context
      ctx.rotate(this.rotation)

      // Draw the image centered at the origin (which is now at the obstacle's position)
      ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2)

      // Restore the context to its original state
      ctx.restore()
    } else {
      // Fallback to circle if image is not available
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.closePath()
    }
  }
}

export class Food extends GameObject {
  bobOffset: number
  bobSpeed: number

  constructor(x: number, y: number, radius: number, color: string, image: HTMLImageElement | null = null) {
    super(x, y, radius, color, image)
    this.bobOffset = Math.random() * Math.PI * 2 // Random starting point for bobbing
    this.bobSpeed = 0.05
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      // Calculate a bobbing effect
      const bobAmount = Math.sin(Date.now() * this.bobSpeed + this.bobOffset) * 3

      // Draw the image with a bobbing effect
      ctx.drawImage(
        this.image,
        this.x - this.radius,
        this.y - this.radius + bobAmount, // Add bobbing to y position
        this.radius * 2,
        this.radius * 2,
      )
    } else {
      // Fallback to circle if image is not available
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.closePath()
    }
  }
}

export { GameObject }

