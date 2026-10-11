'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Press_Start_2P, VT323 } from 'next/font/google'
import ModalShell from '@/components/modal-shell'

/**
 * The music player: a Windows 98 window with an arcade cabinet's screen in it.
 *
 * It is deliberately not built from the site's plates. It is an object from
 * somewhere else, so it brings its own chrome, its own two typefaces and its
 * own palette, and none of them leak: the fonts are only loaded by this file.
 */

const pixel = Press_Start_2P({ weight: '400', subsets: ['latin'], display: 'swap' })
const terminal = VT323({ weight: '400', subsets: ['latin'], display: 'swap' })

export type Song = { title: string; artist: string; audioSrc: string; imgSrc: string }

/** Seconds of each track that play, centred on its midpoint. */
const CLIP = 30

const NEON = {
  pink: '#ff2bd6',
  cyan: '#19f0ff',
  yellow: '#ffe14d',
  violet: '#8a4dff',
  night: '#0a0420',
}

const GREY = '#c0c0c0'
const RAISED = '#ffffff #808080 #808080 #ffffff'
const SUNKEN = '#808080 #ffffff #ffffff #808080'

const raised: React.CSSProperties = {
  background: GREY,
  border: '2px solid',
  borderColor: RAISED,
  boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #0a0a0a',
}

const sunken: React.CSSProperties = {
  border: '2px solid',
  borderColor: SUNKEN,
  boxShadow: 'inset 1px 1px 0 #0a0a0a',
}

const RANKS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH']
const BARS = 18
const BAR_HEIGHT = 46

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** A 98 push button. `pressed` holds it in, the way a latched Play does. */
function Key({
  label,
  pressed = false,
  wide = false,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  wide?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed || undefined}
      style={{
        ...raised,
        ...(pressed
          ? { borderColor: SUNKEN, boxShadow: 'inset 1px 1px 0 #0a0a0a', background: '#d4d4d4' }
          : null),
        // 2px 6px is authentic and unusable with a thumb.
        minWidth: wide ? 58 : 34,
        height: 30,
        padding: '0 8px',
        fontFamily: 'inherit',
        fontSize: 11,
        color: '#000',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {children}
    </button>
  )
}

/** Title-bar button. Only the close one does anything. */
function Chip({ glyph, onClick }: { glyph: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={onClick ? 'Close' : undefined}
      aria-hidden={onClick ? undefined : true}
      tabIndex={onClick ? 0 : -1}
      style={{
        ...raised,
        width: 18,
        height: 16,
        padding: 0,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
        color: '#000',
        cursor: onClick ? 'pointer' : 'default',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {glyph}
    </button>
  )
}

/**
 * The disc. The rainbow is a fixed conic gradient under a turning one, which is
 * roughly what a real CD does: the colours belong to the light, the faint
 * radial streaks belong to the disc.
 */
function CompactDisc({ src, playing }: { src: string; playing: boolean }) {
  const SIZE = 136
  const LABEL = Math.round(SIZE * 0.44)

  return (
    <div
      style={{
        ...sunken,
        position: 'relative',
        width: SIZE + 20,
        height: SIZE + 20,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: `radial-gradient(circle at 50% 45%, #2a1a4d, ${NEON.night} 72%)`,
      }}
    >
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
        {/* the light on it, which does not turn */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'conic-gradient(from 20deg, #e9e9ee, #9fe8ff 40deg, #c7a6ff 75deg, #ff9fe0 105deg, #e9e9ee 140deg, #d6d6dc 200deg, #a6ffd9 235deg, #fff3a6 265deg, #ffb0a6 290deg, #e9e9ee 330deg)',
            boxShadow: `0 0 0 1px #6b6b78, 0 0 14px ${NEON.violet}66`,
          }}
        />

        {/* the disc itself */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.22) 0deg 4deg, rgba(255,255,255,0) 4deg 18deg, rgba(0,0,0,0.10) 18deg 22deg, rgba(0,0,0,0) 22deg 40deg)',
            animation: 'vinyl-spin 2.6s linear infinite',
            animationPlayState: playing ? 'running' : 'paused',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: LABEL,
              height: LABEL,
              marginLeft: -LABEL / 2,
              marginTop: -LABEL / 2,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.75), 0 0 0 3px rgba(0,0,0,0.35)',
            }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
          </div>
        </div>

        {/* clear hub and spindle hole */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 22,
            height: 22,
            marginLeft: -11,
            marginTop: -11,
            borderRadius: '50%',
            background: 'rgba(235,235,245,0.85)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: NEON.night }} />
        </div>
      </div>
    </div>
  )
}

/** The cabinet screen: score line, title, equaliser, and a prompt. */
function Screen({
  song,
  index,
  total,
  playing,
  elapsed,
  bars,
}: {
  song: Song
  index: number
  total: number
  playing: boolean
  elapsed: number
  bars: number[]
}) {
  const glow = (c: string) => `0 0 6px ${c}, 0 0 14px ${c}88`

  return (
    <div
      style={{
        ...sunken,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${NEON.night} 0%, #1a0b3d 62%, #3a0f52 100%)`,
        padding: '9px 10px 8px',
        color: '#fff',
      }}
    >
      {/* A low sun, striped the way every 1984 box cover striped it. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 14,
          bottom: -26,
          width: 96,
          height: 96,
          borderRadius: '50%',
          opacity: 0.38,
          background: `linear-gradient(180deg, ${NEON.yellow} 0%, #ff8a3d 45%, ${NEON.pink} 100%)`,
          WebkitMaskImage:
            'repeating-linear-gradient(180deg, #000 0 9px, transparent 9px 12px)',
          maskImage: 'repeating-linear-gradient(180deg, #000 0 9px, transparent 9px 12px)',
        }}
      />

      <div
        className={pixel.className}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          fontSize: 8,
          letterSpacing: 0.5,
        }}
      >
        <span style={{ color: NEON.pink, textShadow: glow(NEON.pink) }}>PLAYER 1</span>
        <span style={{ color: NEON.yellow }}>
          TRK {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
      </div>

      <div
        className={pixel.className}
        style={{
          position: 'relative',
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.35,
          color: NEON.cyan,
          textShadow: glow(NEON.cyan),
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {song.title}
      </div>
      <div
        className={terminal.className}
        style={{
          position: 'relative',
          fontSize: 19,
          lineHeight: 1.1,
          color: NEON.pink,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {song.artist}
      </div>

      {/* Equaliser. Decorative: real analysis would need an AudioContext per
          track. The colour is one gradient sized to the full column, so a short
          bar is cyan and only a tall one reaches the yellow. */}
      <div
        aria-hidden
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
          height: BAR_HEIGHT,
          marginTop: 8,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0 4px, ${NEON.night} 4px 6px), linear-gradient(0deg, ${NEON.cyan} 0%, ${NEON.violet} 45%, ${NEON.pink} 75%, ${NEON.yellow} 100%)`,
              backgroundSize: `100% 6px, 100% ${BAR_HEIGHT}px`,
              backgroundPosition: 'bottom, bottom',
              backgroundRepeat: 'repeat-y, no-repeat',
              transition: 'height 0.11s steps(3)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 7,
        }}
      >
        <span
          className={terminal.className}
          style={{ fontSize: 19, lineHeight: 1, color: NEON.yellow, letterSpacing: 1 }}
        >
          {clock(elapsed)} / {clock(CLIP)}
        </span>
        <span
          className={pixel.className}
          style={{
            fontSize: 8,
            color: playing ? NEON.cyan : '#fff',
            animation: playing ? undefined : 'arcade-blink 1.1s steps(1) infinite',
          }}
        >
          {playing ? 'NOW PLAYING' : 'PRESS PLAY'}
        </span>
      </div>

      {/* scanlines, over everything on the tube */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.28) 2px 3px)',
          boxShadow: 'inset 0 0 28px rgba(0,0,0,0.65)',
        }}
      />
    </div>
  )
}

export default function MusicPlayer({ songs, onClose }: { songs: Song[]; onClose: () => void }) {
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [elapsed, setElapsed] = useState(0)
  const [bars, setBars] = useState<number[]>(() => Array(BARS).fill(4))
  const audioRef = useRef<HTMLAudioElement>(null)
  // Read inside the audio handlers, which should not be re-attached on every
  // play and pause.
  const playingRef = useRef(playing)
  playingRef.current = playing

  useEffect(() => {
    if (!playing) {
      setBars(Array(BARS).fill(4))
      return
    }
    const id = setInterval(() => {
      setBars(
        Array.from({ length: BARS }, (_, i) => {
          // Weighted toward the low end, like most music.
          const ceiling = BAR_HEIGHT * (1 - (i / BARS) * 0.45)
          return 6 + Math.random() * (ceiling - 6)
        }),
      )
    }, 120)
    return () => clearInterval(id)
  }, [playing])

  // Each track plays the thirty seconds around its midpoint.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setElapsed(0)

    const start = () => Math.max(0, (audio.duration || 0) / 2 - CLIP / 2)

    const onMeta = () => {
      audio.currentTime = start()
      if (playingRef.current) audio.play().catch(() => {})
    }
    const onTime = () => {
      if (!audio.duration) return
      const t = audio.currentTime - start()
      setElapsed(Math.min(CLIP, Math.max(0, t)))
      if (t >= CLIP) {
        audio.pause()
        audio.currentTime = start()
        setPlaying(false)
        setElapsed(0)
      }
    }
    const onEnded = () => setPlaying(false)

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!playing) audio.pause()
    // Before the metadata is in there is nowhere to seek to yet; the handler
    // above starts it from the right place once there is.
    else if (audio.readyState >= 1) audio.play().catch(() => {})
  }, [playing, track])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const select = (i: number) => {
    setTrack((i + songs.length) % songs.length)
    setPlaying(true)
  }

  const stop = () => {
    const audio = audioRef.current
    setPlaying(false)
    setElapsed(0)
    if (audio?.duration) audio.currentTime = Math.max(0, audio.duration / 2 - CLIP / 2)
  }

  const song = songs[track]
  const BLOCKS = 24
  const filled = Math.round((elapsed / CLIP) * BLOCKS)

  return (
    <ModalShell
      label="Music player"
      onClose={onClose}
      panelStyle={{
        ...raised,
        padding: 2,
        fontFamily: 'Tahoma, "MS Sans Serif", "Segoe UI", Arial, sans-serif',
        color: '#000',
        width: '100%',
        maxWidth: 580,
        maxHeight: 'calc(100dvh - 2rem)',
        overflowY: 'auto',
      }}
    >
      <audio ref={audioRef} src={song.audioSrc} preload="metadata" />

      {/* Title bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #000080, #1084d0)',
          color: '#fff',
          padding: '3px 3px 3px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            flexShrink: 0,
            background: `conic-gradient(${NEON.cyan}, ${NEON.pink}, ${NEON.yellow}, ${NEON.cyan})`,
            boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.55), inset 0 0 0 5px rgba(0,0,0,0.4)',
          }}
        />
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Jukebox.exe - {song.title}
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <Chip glyph="_" />
          <Chip glyph="□" />
          <span style={{ width: 2 }} />
          <Chip glyph="×" onClick={onClose} />
        </div>
      </div>

      {/* Menu bar. Furniture: none of it opens. */}
      <div aria-hidden style={{ display: 'flex', gap: 14, padding: '4px 8px 3px', fontSize: 12 }}>
        {['Disc', 'View', 'Options', 'Help'].map(word => (
          <span key={word}>
            <u>{word[0]}</u>
            {word.slice(1)}
          </span>
        ))}
      </div>

      <div style={{ padding: '6px 8px 8px', borderTop: '1px solid #808080', boxShadow: 'inset 0 1px 0 #fff' }}>
        {/* The disc sits beside the screen where there is room and stacks
            above it where there is not. */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <CompactDisc src={song.imgSrc} playing={playing} />
          <div style={{ flex: '1 1 250px', minWidth: 0 }}>
            <Screen
              song={song}
              index={track}
              total={songs.length}
              playing={playing}
              elapsed={elapsed}
              bars={bars}
            />
          </div>
        </div>

        {/* Progress, in the blocks a 98 install dialog counted in. */}
        <div
          role="progressbar"
          aria-label="Position in the preview"
          aria-valuemin={0}
          aria-valuemax={CLIP}
          aria-valuenow={Math.round(elapsed)}
          style={{ ...sunken, background: '#fff', display: 'flex', gap: 2, padding: 2, height: 18, marginTop: 10 }}
        >
          {Array.from({ length: BLOCKS }, (_, i) => (
            <div key={i} style={{ flex: 1, background: i < filled ? '#000080' : 'transparent' }} />
          ))}
        </div>

        {/* Track list, laid out as a high-score table. */}
        <div style={{ ...sunken, background: NEON.night, marginTop: 10, padding: '6px 0 4px' }}>
          <div
            className={pixel.className}
            style={{
              display: 'flex',
              gap: 10,
              padding: '0 10px 5px',
              fontSize: 8,
              color: NEON.yellow,
              letterSpacing: 0.5,
            }}
          >
            <span style={{ width: 34 }}>RANK</span>
            <span>TITLE</span>
            <span style={{ marginLeft: 'auto' }}>ARTIST</span>
          </div>
          {songs.map((s, i) => {
            const current = i === track
            return (
              <button
                key={s.audioSrc}
                onClick={() => select(i)}
                aria-current={current || undefined}
                className={terminal.className}
                style={{
                  display: 'flex',
                  gap: 10,
                  width: '100%',
                  padding: '3px 10px',
                  border: 0,
                  textAlign: 'left',
                  fontSize: 19,
                  lineHeight: 1.15,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  background: current ? NEON.cyan : 'transparent',
                  color: current ? NEON.night : '#e8e0ff',
                }}
              >
                <span style={{ width: 34, color: current ? NEON.night : NEON.pink }}>{RANKS[i] ?? i + 1}</span>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    paddingLeft: 8,
                    whiteSpace: 'nowrap',
                    color: current ? NEON.night : '#a99ad6',
                  }}
                >
                  {s.artist}
                </span>
              </button>
            )
          })}
        </div>

        {/* Transport and volume */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            <Key label="Previous track" onClick={() => select(track - 1)}>|◄◄</Key>
            <Key label={playing ? 'Pause' : 'Play'} pressed={playing} wide onClick={() => setPlaying(v => !v)}>
              {playing ? (
                // Drawn, because the pause glyph is missing from most 98-era
                // faces and falls back to something else entirely.
                <span aria-hidden style={{ display: 'flex', gap: 3 }}>
                  <span style={{ width: 3, height: 10, background: '#000' }} />
                  <span style={{ width: 3, height: 10, background: '#000' }} />
                </span>
              ) : (
                '►'
              )}
            </Key>
            <Key label="Stop" onClick={stop}>■</Key>
            <Key label="Next track" onClick={() => select(track + 1)}>►►|</Key>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <span>
              <u>V</u>olume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ width: 92, cursor: 'pointer', accentColor: '#000080' }}
            />
          </label>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', gap: 2, padding: '0 2px 2px', fontSize: 11 }}>
        <div style={{ ...sunken, boxShadow: 'none', borderWidth: 1, flex: 1, padding: '2px 6px' }}>
          {playing ? 'Playing' : 'Ready'}
        </div>
        <div style={{ ...sunken, boxShadow: 'none', borderWidth: 1, padding: '2px 6px' }}>30 s preview</div>
        <div style={{ ...sunken, boxShadow: 'none', borderWidth: 1, padding: '2px 6px' }}>Stereo</div>
      </div>
    </ModalShell>
  )
}
