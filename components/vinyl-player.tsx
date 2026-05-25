"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Song {
  id: number
  title: string
  artist: string
  duration: number // in seconds, max ~30
}

const SONGS: Song[] = [
  { id: 1, title: "Midnight Dreams", artist: "Unknown", duration: 30 },
  { id: 2, title: "Ocean Waves", artist: "Unknown", duration: 30 },
  { id: 3, title: "City Lights", artist: "Unknown", duration: 30 },
  { id: 4, title: "Sunset Boulevard", artist: "Unknown", duration: 30 },
  { id: 5, title: "Morning Coffee", artist: "Unknown", duration: 30 },
]

export default function VinylPlayer() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDraggingVinyl, setIsDraggingVinyl] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isPlaying && selectedSong) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + (100 / (selectedSong.duration * 10))
        })
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, selectedSong])

  const handleSongSelect = (song: Song) => {
    if (selectedSong?.id === song.id) {
      // Toggle play/pause
      setIsPlaying(!isPlaying)
    } else {
      setSelectedSong(song)
      setProgress(0)
      setIsPlaying(true)
    }
  }

  const handleVinylClick = () => {
    if (selectedSong) {
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          what faheem is listening to
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Song List */}
        <div className="flex-1 space-y-1">
          {SONGS.map((song, index) => (
            <motion.button
              key={song.id}
              onClick={() => handleSongSelect(song)}
              className={`w-full text-left py-2 px-3 rounded-sm transition-all duration-200 group interactive ${
                selectedSong?.id === song.id
                  ? "bg-foreground text-background"
                  : "hover:bg-secondary"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </div>
                {selectedSong?.id === song.id && isPlaying && (
                  <motion.div
                    className="flex gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-current"
                        animate={{
                          height: [4, 12, 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Vinyl Player */}
        <div className="relative w-40 h-40 flex-shrink-0">
          {/* Turntable Base */}
          <div className="absolute inset-0 bg-secondary rounded-lg border border-border shadow-sm" />
          
          {/* Vinyl */}
          <motion.div
            className="absolute inset-2 rounded-full bg-foreground cursor-pointer interactive"
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
            onClick={handleVinylClick}
            drag={!isPlaying}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDraggingVinyl(true)}
            onDragEnd={() => setIsDraggingVinyl(false)}
          >
            {/* Grooves */}
            <div className="absolute inset-0 rounded-full vinyl-groove opacity-30" />
            
            {/* Shine */}
            <div className="absolute inset-0 rounded-full vinyl-shine" />
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center"
                animate={{
                  rotate: isPlaying ? -360 : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-foreground" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tonearm */}
          <motion.div
            className="absolute top-2 right-2 w-1 h-16 bg-muted-foreground rounded-full origin-top"
            animate={{
              rotate: selectedSong && isPlaying ? 25 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-3 bg-foreground rounded-sm" />
          </motion.div>

          {/* Progress indicator */}
          {selectedSong && (
            <div className="absolute -bottom-6 left-0 right-0">
              <div className="h-0.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-foreground"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Now Playing Info */}
      <AnimatePresence mode="wait">
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-xs font-mono text-muted-foreground">
              {isPlaying ? "now playing" : "paused"} - {selectedSong.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center font-mono">
        click a song to play - click vinyl to pause
      </p>
    </div>
  )
}
