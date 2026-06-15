'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface Props {
  src: string
  dauer?: number | null
}

export function AudioPlayer({ src, dauer }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(dauer ?? 0)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const onTime = () => setCurrent(a.currentTime)
    const onDuration = () => { if (isFinite(a.duration)) setDuration(a.duration) }
    const onEnded = () => { setPlaying(false); setCurrent(0) }

    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onDuration)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onDuration)
      a.removeEventListener('ended', onEnded)
    }
  }, [src])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    a.currentTime = ratio * duration
  }

  function cycleSpeed() {
    const a = audioRef.current
    if (!a) return
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1
    a.playbackRate = next
    setSpeed(next)
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 bg-[#F7F7F5] rounded-xl px-3 py-2.5">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-[#2C2C2C] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
      >
        {playing
          ? <Pause size={14} fill="white" color="white" />
          : <Play size={14} fill="white" color="white" className="ml-0.5" />
        }
      </button>

      {/* Fortschrittsbalken */}
      <div
        className="flex-1 h-1.5 bg-[#2C2C2C]/15 rounded-full cursor-pointer relative"
        onClick={seek}
      >
        <div
          className="h-full bg-[#2C2C2C] rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[#2C2C2C]/50 font-semibold text-[12px] tabular-nums shrink-0">
        {fmt(current)}&nbsp;/&nbsp;{fmt(duration)}
      </span>

      <button
        onClick={cycleSpeed}
        className="text-[11px] font-extrabold text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors shrink-0 w-7 text-center"
      >
        {speed}×
      </button>
    </div>
  )
}
