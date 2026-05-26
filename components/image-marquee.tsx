"use client"

import React from "react"

const MARQUEE_IMAGES = [
  "/images/dubai-metro-3.jpg",
  "/images/dubai-metro-1.jpg",
  "/images/dubai-metro-2.jpg",
  "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
  "https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg",
  "https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg",
  "https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg",
  "https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg",
  "https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg",
]

export default function ImageMarquee() {
  // Duplicate images for seamless loop
  const doubled = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES]

  return (
    <div className="w-full overflow-hidden py-2">
      <div className="flex gap-3 marquee-track">
        {doubled.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden bg-foreground/5"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
