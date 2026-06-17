"use client"

import { useEffect, useRef } from "react"

export default function HeroWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let width = 0
    let height = 0
    let imageData: ImageData
    let data: Uint8ClampedArray
    let raf = 0
    const SCALE = 3

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      width = Math.floor(canvas.width / SCALE)
      height = Math.floor(canvas.height / SCALE)
      imageData = ctx.createImageData(width, height)
      data = imageData.data
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const startTime = Date.now()

    const SIN_TABLE = new Float32Array(1024)
    const COS_TABLE = new Float32Array(1024)
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2
      SIN_TABLE[i] = Math.sin(angle)
      COS_TABLE[i] = Math.cos(angle)
    }
    const fastSin = (x: number) => SIN_TABLE[Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023]
    const fastCos = (x: number) => COS_TABLE[Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023]

    const render = () => {
      const time = (Date.now() - startTime) * 0.001

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const u_x = (2 * x - width) / height
          const u_y = (2 * y - height) / height

          let a = 0
          let d = 0
          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * u_x)
            d += fastSin(i * u_y + a)
          }

          const wave = (fastSin(a) + fastCos(d)) * 0.5
          const intensity = 0.3 + 0.4 * wave
          const baseVal = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.3)
          const accent = baseVal + 0.2 * fastSin(a * 1.5 + time * 0.2) + 0.1

          // paleta Drop: cyan/teal sobre quase-preto, com brilho realçado
          const tone = Math.max(0, Math.min(1, accent)) * intensity
          const boost = 2.6
          const r = Math.min(1, tone * 0.12 * boost)
          const g = Math.min(1, tone * 0.62 * boost)
          const b = Math.min(1, tone * 0.82 * boost)

          const index = (y * width + x) * 4
          data[index] = r * 255
          data[index + 1] = g * 255
          data[index + 2] = b * 255
          data[index + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height)

      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className={className ?? "absolute inset-0 h-full w-full"} aria-hidden />
}
