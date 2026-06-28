'use client'

import { useEffect, useRef } from 'react'

type Shape =
  | { type: 'rect'; x: number; y: number; w: number; h: number }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'arc'; cx: number; cy: number; r: number; start: number; stop: number; closed?: boolean }
  | { type: 'curve'; points: [number, number][] }

interface SketchIconProps {
  width: number
  height: number
  shapes: Shape[]
  roughness?: number
  strokeWidth?: number
  color?: string
  seed?: number
}

export function SketchIcon({
  width,
  height,
  shapes,
  roughness = 1.8,
  strokeWidth = 2.2,
  color = '#F5C400',
  seed = 42,
}: SketchIconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    import('roughjs').then(({ default: rough }) => {
      const svg = svgRef.current!
      // clear previous renders
      while (svg.firstChild) svg.removeChild(svg.firstChild)

      const rc = rough.svg(svg, { options: { roughness, strokeWidth, stroke: color, seed, fill: 'none', disableMultiStrokeFill: true } })

      for (const shape of shapes) {
        let el: SVGGElement | null = null

        if (shape.type === 'rect') {
          el = rc.rectangle(shape.x, shape.y, shape.w, shape.h)
        } else if (shape.type === 'circle') {
          el = rc.circle(shape.cx, shape.cy, shape.r * 2)
        } else if (shape.type === 'line') {
          el = rc.line(shape.x1, shape.y1, shape.x2, shape.y2)
        } else if (shape.type === 'arc') {
          el = rc.arc(shape.cx, shape.cy, shape.r * 2, shape.r * 2, shape.start, shape.stop, shape.closed ?? false)
        } else if (shape.type === 'curve') {
          el = rc.curve(shape.points)
        }

        if (el) svg.appendChild(el)
      }
    })
  }, [shapes, roughness, strokeWidth, color, seed])

  return <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" />
}
