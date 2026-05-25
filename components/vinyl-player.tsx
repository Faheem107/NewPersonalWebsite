"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Song {
  id: number
  title: string
  artist: string
}

const SONGS: Song[] = [
  { id: 1, title: "Redbone", artist: "Childish Gambino" },
  { id: 2, title: "Pink + White", artist: "Frank Ocean" },
  { id: 3, title: "Nights", artist: "Frank Ocean" },
  { id: 4, title: "Solo", artist: "Frank Ocean" },
  { id: 5, title: "Self Control", artist: "Frank Ocean" },
]

export default function VinylPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSongSelect = (song: Song) => {
    if (selectedSong?.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setSelectedSong(song)
      setIsPlaying(true)
    }
  }

  return (
    <>
      {/* Clickable Vinyl Image */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative w-24 h-24 md:w-32 md:h-32 interactive"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying && !isOpen ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying && !isOpen ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
      >
        <Image
          src="/images/vinyl-pixel.png"
          alt="Vinyl Player"
          fill
          className="object-contain pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}
            >
              {/* Title Bar */}
              <div className="flex items-center justify-between px-2 py-1 bg-[#000080] text-white">
                <span className="text-sm font-bold">what faheem is listening to</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-black text-xs font-bold leading-none interactive"
                >
                  x
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Vinyl Display */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    className="relative w-32 h-32"
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                  >
                    <Image
                      src="/images/vinyl-pixel.png"
                      alt="Vinyl"
                      fill
                      className="object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </motion.div>
                </div>

                {/* Song List */}
                <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1">
                  {SONGS.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => handleSongSelect(song)}
                      className={`w-full text-left px-2 py-1 text-sm interactive ${
                        selectedSong?.id === song.id
                          ? "bg-[#000080] text-white"
                          : "hover:bg-[#000080] hover:text-white"
                      }`}
                      style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{song.title}</span>
                        <span className="text-xs opacity-70">{song.artist}</span>
                      </div>
                      {selectedSong?.id === song.id && isPlaying && (
                        <div className="flex gap-0.5 mt-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-current"
                              animate={{ height: [2, 8, 2] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Now Playing */}
                {selectedSong && (
                  <div className="mt-3 text-center text-xs" style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}>
                    {isPlaying ? "Now Playing:" : "Paused:"} {selectedSong.title} - {selectedSong.artist}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => selectedSong && setIsPlaying(!isPlaying)}
                    disabled={!selectedSong}
                    className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-sm active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white disabled:opacity-50 interactive"
                    style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-sm active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white interactive"
                    style={{ fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
