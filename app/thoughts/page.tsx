"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import VantaBackground from "@/components/vanta-bg"

const THOUGHTS = [
  {
    date: "May 26, 2026",
    title: "What colour is a mirror?",
    content: `Most people say silver. Some say grey. But a perfect mirror doesn't really have a colour at all — it just shows you everything around it. If you put two perfect mirrors facing each other, the space between them would be completely black, because no light could ever escape.

Here's what's strange though: a real mirror is actually very slightly green. The glass absorbs more red and blue light than green, so if you photograph an infinite mirror tunnel, you'll notice the reflections get progressively greener as they go deeper.

We spend our entire lives looking at mirrors and we still can't agree on what colour they are. That says something about perception. Or maybe just about how rarely we stop to actually think about the things we see every day.`
  },
  {
    date: "May 21, 2026",
    title: "You are mostly empty space — but you've never fallen through a floor",
    content: `Atoms are 99.9999999999996% empty space. If you took all the matter in the human body — every proton, neutron, and electron — and compressed it down with no empty space, you'd fit every human who has ever lived into a volume the size of a sugar cube.

So why don't you fall through your chair? Not because of matter. Because of the electromagnetic force. The electrons on the surface of your body repel the electrons on the surface of your chair. You've never actually touched anything in your life. The feeling of touch is just repulsion — atoms pushing back against atoms.

Think about that the next time you shake someone's hand.`
  },
  {
    date: "May 17, 2026",
    title: "If you folded a piece of paper 103 times, it would be larger than the observable universe",
    content: `A piece of paper is about 0.1 mm thick. Every time you fold it, it doubles. After 7 folds: roughly the thickness of a notebook. After 23 folds: about 1 kilometre. After 42 folds: you've reached the Moon. After 51: the Sun. After 103 folds, you exceed the diameter of the observable universe — 93 billion light years across.

You can't actually fold a standard sheet more than about 7 or 8 times. But the mathematics doesn't care. The physical impossibility and the mathematical certainty coexist in a way I find genuinely beautiful.

This is exponential growth. We're terrible at intuiting it. Terrible. And it shows up everywhere — in pandemics, in compound interest, in the doubling time of computation. We keep being surprised by it as if we haven't been warned.`
  },
  {
    date: "May 13, 2026",
    title: "There are more possible chess games than atoms in the observable universe",
    content: `The number of atoms in the observable universe is estimated at around 10^80. The number of possible chess games — the Shannon number — is roughly 10^120. There are more ways to play a game of chess than there are atoms in everything we can see.

No two long chess games in all of human history have ever been identical. Every game is genuinely unique. Every position you've ever played has almost certainly never been reached before and will almost certainly never be reached again.

We talk about "exploring" physical space, but the combinatorial space of even simple rule-based systems dwarfs the physical universe entirely. Mathematics contains infinities that physics can't touch. That asymmetry between the abstract and the physical is something I keep coming back to.`
  },
  {
    date: "May 9, 2026",
    title: "The Sun is white. Not yellow. Not orange. White.",
    content: `Our star emits light that peaks right in the middle of the visible spectrum — roughly 500 nanometres, a blue-green. But it emits broadly across all visible wavelengths, which means the combined light is essentially white.

We perceive it as yellow because Earth's atmosphere scatters short-wavelength (blue) light in all directions — which is why the sky is blue — leaving the direct sunlight looking slightly warmer. Near sunrise and sunset, the light travels through more atmosphere, scattering away even more blue and green, leaving only reds and oranges.

Astronauts in the ISS, outside the atmosphere, confirm it: the Sun is white. We've built our entire aesthetic vocabulary around a star colour that is, technically, a perceptual artefact of living at the bottom of an ocean of air.`
  },
  {
    date: "May 4, 2026",
    title: "A day on Venus is longer than a year on Venus",
    content: `Venus rotates so slowly on its axis that a single Venusian day — the time it takes to spin once — lasts about 243 Earth days. But it completes a full orbit around the Sun in only 225 Earth days.

So on Venus, you'd complete an entire trip around the Sun before the Sun has even risen and set once.

It also rotates backwards compared to most planets. If you stood on Venus and could see the Sun through its thick clouds, it would rise in the west and set in the east. Which makes me wonder about the nature of "east" and "west" — they're not cosmically meaningful directions. They're just what we call the direction our planet happens to spin toward. Change the planet, change the compass.`
  },
  {
    date: "April 29, 2026",
    title: "The number 1 appears as the leading digit far more often than you'd expect",
    content: `If you look at a random collection of real-world numbers — populations of cities, lengths of rivers, stock prices, physical constants — about 30% of them will start with the digit 1. Only about 4.6% start with 9. This is called Benford's Law and it applies to an astonishing range of data.

Why? Because going from 1 to 2 requires a 100% increase. Going from 8 to 9 only requires about 12.5%. In any system that grows by percentages — which is how most natural and human systems grow — smaller leading digits are simply encountered more often on the way up.

Forensic accountants use this to catch fraud. Fabricated numbers tend to have leading digits distributed uniformly, because humans don't have good intuitions about logarithmic distributions. The universe does.`
  },
  {
    date: "April 24, 2026",
    title: "You are made of star stuff — but also of the Big Bang itself",
    content: `Carl Sagan popularised the idea that we are made of star stuff — and it's true. Most of the carbon, oxygen, nitrogen, and iron in your body was forged inside stars that died billions of years before our solar system existed.

But the hydrogen in your body — about 60% of your atoms by count — was made in the Big Bang itself. Those protons in your water molecules are 13.8 billion years old. They've been here since the universe was three minutes old, drifting through the void, cycling through stars and nebulae and planets and oceans and other living things before ending up, for now, as part of you.

"For now" is doing a lot of work in that sentence. None of this is permanent. The atoms will scatter. They've been somewhere before. They'll be somewhere after. We're an arrangement, not a thing.`
  },
]

export default function ThoughtsPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />
      <VantaBackground type="net" />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-8 pt-36 pb-24 relative z-10">
        <motion.header
          className="mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight mb-5">
            Some Thoughts!
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md">
            Musings on physics, mathematics, and the general strangeness of existing in this particular universe.
          </p>
        </motion.header>

        <div className="space-y-0">
          {THOUGHTS.map((thought, index) => (
            <motion.article
              key={thought.date}
              className="border-b border-border/40 py-10 last:border-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-xs font-mono text-muted-foreground/60 tracking-wider">
                {thought.date}
              </span>
              <h2 className="text-xl font-sans font-bold tracking-tight mt-2 mb-5">
                {thought.title}
              </h2>
              <div className="space-y-4">
                {thought.content.split("\n\n").map((p, i) => (
                  <p key={i} className="text-sm leading-[1.85] text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-xs font-mono text-muted-foreground/40"
        >
          More incoming — probably at 2am
        </motion.p>
      </div>
    </main>
  )
}