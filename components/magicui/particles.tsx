"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  color?: string
  vx?: number
  vy?: number
  refresh?: boolean
}

interface Circle {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

function hexToRgb(hex: string): number[] {
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.split("").map(c => c + c).join("")
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Ambient canvas starfield with mouse-reactive particles (Magic UI style). */
export function Particles({
  className,
  quantity = 80,
  staticity = 50,
  ease = 50,
  color = "#8b5cf6",
  vx = 0,
  vy = 0,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<Circle[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rafId = useRef<number | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (canvasRef.current) context.current = canvasRef.current.getContext("2d")
    initCanvas()
    animate()
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = e.clientX - rect.left - w / 2
      const y = e.clientY - rect.top - h / 2
      if (x < w / 2 + w / 2 && x > -w / 2 && y < h && y > -h) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
    window.addEventListener("mousemove", onMove)
    resizeObserver.current = new ResizeObserver(() => initCanvas())
    if (containerRef.current) resizeObserver.current.observe(containerRef.current)
    return () => {
      window.removeEventListener("mousemove", onMove)
      resizeObserver.current?.disconnect()
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, refresh])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const resizeCanvas = () => {
    if (containerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = containerRef.current.offsetWidth
      canvasSize.current.h = containerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
      circles.current = []
    }
  }

  const drawParticles = () => {
    for (let i = 0; i < quantity; i++) {
      const { w, h } = canvasSize.current
      circles.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        translateX: 0,
        translateY: 0,
        size: Math.random() * 2 + 0.6,
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.1,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
        magnetism: 0.1 + Math.random() * 3,
      })
    }
  }

  const drawCircle = (circle: Circle, update = false) => {
    if (!context.current) return
    const { translateX, translateY, x, y, size, alpha } = circle
    context.current.translate(translateX, translateY)
    context.current.beginPath()
    context.current.arc(x, y, size, 0, 2 * Math.PI)
    const rgb = hexToRgb(color)
    context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
    context.current.fill()
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!update) circles.current.push(circle)
  }

  const animate = () => {
    if (!context.current) return
    const { w, h } = canvasSize.current
    context.current.clearRect(0, 0, w, h)
    circles.current.forEach((circle, i) => {
      // fade edges
      const edge = Math.min(circle.x + circle.translateX, w - (circle.x + circle.translateX), circle.y + circle.translateY, h - (circle.y + circle.translateY))
      const closestEdge = Math.max(Math.min(edge / 20, 1), 0)
      if (closestEdge > 0) {
        circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha * closestEdge)
      } else {
        circle.alpha = Math.max(circle.alpha - 0.02, 0)
      }
      circle.x += circle.dx + vx
      circle.y += circle.dy + vy
      // gentle magnetism towards the cursor
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / Math.max(20, ease / 2.5)
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / Math.max(20, ease / 2.5)
      drawCircle(circle, true)
      if (circle.x < -circle.size || circle.x > w + circle.size || circle.y < -circle.size || circle.y > h + circle.size) {
        circles.current.splice(i, 1)
        const { w: cw, h: ch } = canvasSize.current
        drawCircle({
          x: Math.random() * cw,
          y: Math.random() * ch,
          translateX: 0,
          translateY: 0,
          size: Math.random() * 2 + 0.6,
          alpha: 0,
          targetAlpha: Math.random() * 0.5 + 0.1,
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.15,
          magnetism: 0.1 + Math.random() * 3,
        }, true)
      }
    })
    rafId.current = requestAnimationFrame(animate)
  }

  return (
    <div ref={containerRef} className={cn("pointer-events-none", className)} aria-hidden="true">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
