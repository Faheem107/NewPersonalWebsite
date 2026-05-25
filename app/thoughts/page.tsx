"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"

const THOUGHTS = [
  {
    date: "May 23, 2026",
    title: "On the peculiar habit of naming our AIs",
    content: `There is something deeply human about our need to name things. We name our cars, our plants, our Roombas. And now we name our AI assistants - Siri, Alexa, Claude. But here is the funny thing: we anthropomorphize these systems while simultaneously being terrified of them becoming too human.

I was talking to my friend about this over coffee yesterday. She was worried about AI taking over creative jobs, while also complaining that her smart home assistant could not understand her accent. The irony was not lost on either of us.

Maybe the real question is not whether AI will become conscious, but why we so desperately want to treat it like it already is. There is a certain loneliness in talking to a machine and pretending it understands. Or maybe it is not pretending - maybe understanding is just pattern matching all the way down, and we have been doing it to each other this whole time.

Anyway, I am naming my new plant "Algorithm." It seems fitting.`
  },
  {
    date: "May 18, 2026",
    title: "Infinity is smaller than I thought",
    content: `Here is something that broke my brain this week: some infinities are bigger than others. Georg Cantor proved this in the 1870s, and mathematicians have not recovered since.

The integers are infinite. The real numbers are infinite. But the real numbers are MORE infinite than the integers. You cannot match them up one-to-one. There will always be real numbers left over, no matter how clever your matching system.

I tried explaining this to my grandmother. She nodded politely and asked if I wanted more tea. Sometimes I think she understands mathematics better than I do - she just does not feel the need to torture herself with it.

The really wild part is that there are infinitely many sizes of infinity. Each one bigger than the last, stretching up forever. Makes my problems feel appropriately small.`
  },
  {
    date: "May 12, 2026",
    title: "The universe does not care about your deadline",
    content: `I was stressing about a research paper due this week when I made the mistake of reading about the heat death of the universe. In about 10^100 years, all stars will burn out, all matter will decay, and the universe will become an endless, dark, cold void.

This is either the most depressing thing ever or incredibly liberating, depending on how you look at it.

I chose liberating. Finished the paper in two hours.

There is a certain freedom in cosmic nihilism. Not the edgy teenager kind, but the genuine recognition that the universe has no opinions about your grades, your career, or whether you remembered to email that professor back. It just... is.

Of course, this philosophy conveniently disappears when I am stuck in traffic or my code will not compile. The universe may not care, but I definitely do.`
  },
  {
    date: "May 7, 2026",
    title: "Why do we keep building taller buildings?",
    content: `I watched a documentary about skyscrapers yesterday. Humans have been building tall things since we figured out how to stack rocks. Pyramids, cathedrals, now glass and steel towers that scrape actual clouds.

The official reasons are always practical: more space, economic efficiency, prestigious addresses. But I think the real reason is simpler: we want to get closer to something. To the sky, to the gods, to whatever is up there. We have been reaching upward since we first stood on two legs.

The Burj Khalifa is 828 meters tall. We could build taller. Much taller, apparently. But at some point you are just building a monument to the fact that you could build it.

Maybe that is enough. Maybe human ingenuity is its own justification. We build because we can, because the alternative is standing still, and standing still has never been our thing.`
  },
  {
    date: "May 2, 2026",
    title: "A brief meditation on coffee",
    content: `I am on my third cup today, which feels relevant to disclose.

There is something profound about coffee. Not the caffeine - though yes, the caffeine - but the ritual of it. The morning cup. The mid-afternoon necessity. The late-night poor decision that you know you will regret but make anyway.

Coffee is proof that humans will find ways to make consciousness more intense even when consciousness is already plenty intense, thank you very much. We took a bean, roasted it, ground it, poured hot water through it, and decided that the resulting brown liquid was essential to functioning in society.

An alien species observing us would have questions.

But here is the thing: that first sip in the morning, when you are not quite awake and the world is still soft around the edges? That is as close to magic as I have found. The warmth spreading through you, the fog lifting, the day becoming possible.

Worth the mild addiction, I think.`
  },
  {
    date: "April 28, 2026",
    title: "The paradox of trying not to think about elephants",
    content: `Do not think about a pink elephant.

You thought about it. Everyone does. The instruction to not think about something requires you to first think about what you are not supposed to think about. It is a perfect little paradox that reveals something about how minds work.

I have been thinking about this in the context of anxiety. The more you try not to worry about something, the more you worry about it. The solution, apparently, is not to try to stop thinking - it is to acknowledge the thought and let it pass. Do not fight the elephant. Just notice it is there and go about your day.

Easier said than done, obviously. But there is something comforting in knowing that brains are fundamentally weird for everyone. We are all walking around with these three-pound lumps of neurons trying to make sense of existence, and sometimes they think about elephants whether we want them to or not.

The elephant stays in the room. We just learn to live with it.`
  }
]

export default function ThoughtsPage() {
  return (
    <main className="min-h-screen bg-background">
      <CustomCursor />
      <Navigation />

      <div className="max-w-3xl mx-auto px-8 py-24 md:py-32">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block interactive"
          >
            &larr; back home
          </Link>
          <h1 className="text-4xl md:text-5xl font-sans font-light tracking-tight mb-4">
            some thoughts!
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            musings on physics, philosophy, and the general strangeness of being alive
          </p>
        </motion.div>

        {/* Thoughts List */}
        <div className="space-y-16">
          {THOUGHTS.map((thought, index) => (
            <motion.article
              key={thought.date}
              className="border-b border-border pb-16 last:border-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <span className="text-sm font-mono text-muted-foreground">
                {thought.date}
              </span>
              <h2 className="text-xl md:text-2xl font-sans font-medium mt-2 mb-6">
                {thought.title}
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {thought.content.split('\n\n').map((paragraph, pIndex) => (
                  <p 
                    key={pIndex} 
                    className="text-base leading-relaxed text-muted-foreground mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm font-mono text-muted-foreground italic">
            more thoughts incoming... probably at 2am
          </p>
        </motion.div>
      </div>
    </main>
  )
}
