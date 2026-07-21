'use client'

import FieldLines from '@/components/backdrop/field-lines'
import PageHeader from '@/components/page-header'
import { useReveal } from '@/lib/motion/use-reveal'

const THOUGHTS = [
  {
    date: 'May 26, 2026',
    title: 'What colour is a mirror?',
    body: [
      'Most people say silver. Some say grey. But a perfect mirror has no colour at all — it just shows you everything around it. Put two perfect mirrors facing each other and the space between them would be completely black, because no light could ever escape.',
      "Here is the strange part: a real mirror is very slightly green. The glass absorbs a little more red and blue than green, so photograph an infinite mirror tunnel and the reflections get progressively greener as they recede.",
      'We look at mirrors our whole lives and still cannot agree on what colour they are. That says something about perception — or maybe just about how rarely we stop to look at the things we see every day.',
    ],
  },
  {
    date: 'May 21, 2026',
    title: 'You are mostly empty space, and you have never fallen through a floor',
    body: [
      'Atoms are 99.9999999999996% empty space. Compress all the matter in every human who has ever lived — every proton, neutron and electron, with the gaps removed — and it would fit in a sugar cube.',
      'So why do you not fall through your chair? Not because of matter. Because of the electromagnetic force. The electrons on your surface repel the electrons on the chair. You have never actually touched anything. The sensation of touch is repulsion.',
      'Worth thinking about the next time you shake someone’s hand.',
    ],
  },
  {
    date: 'May 17, 2026',
    title: 'Fold a piece of paper 103 times and it is larger than the observable universe',
    body: [
      'Paper is about 0.1 mm thick, and every fold doubles it. Seven folds: roughly a notebook. Twenty-three: about a kilometre. Forty-two: you have reached the Moon. Fifty-one: the Sun. One hundred and three: you exceed the diameter of the observable universe, 93 billion light years across.',
      'You cannot actually fold a sheet more than about seven or eight times. But the mathematics does not care, and the coexistence of physical impossibility with mathematical certainty is something I find genuinely beautiful.',
      'This is exponential growth, and we are terrible at intuiting it. It shows up in pandemics, in compound interest, in the doubling time of computation, and we keep being surprised as though nobody warned us.',
    ],
  },
  {
    date: 'May 13, 2026',
    title: 'There are more possible chess games than atoms in the observable universe',
    body: [
      'Around 10⁸⁰ atoms in the observable universe. Around 10¹²⁰ possible chess games — the Shannon number. There are more ways to play chess than there are atoms in everything we can see.',
      'No two long chess games in history have been identical. Every position you have ever played had almost certainly never been reached before and will almost certainly never be reached again.',
      'We talk about exploring physical space, but the combinatorial space of even simple rule-based systems dwarfs the physical universe entirely. Mathematics contains infinities physics cannot touch.',
    ],
  },
  {
    date: 'May 9, 2026',
    title: 'The Sun is white',
    body: [
      'Not yellow. Not orange. Our star emits light peaking around 500 nanometres — a blue-green — but broadly enough across the visible spectrum that the combined light is essentially white.',
      'We see it as yellow because the atmosphere scatters short wavelengths in all directions, which is why the sky is blue and why the direct beam looks warmer. Near sunrise and sunset the light crosses more atmosphere, loses more blue and green, and leaves only reds.',
      'Astronauts outside the atmosphere confirm it. We built an entire aesthetic vocabulary around a star colour that is a perceptual artefact of living at the bottom of an ocean of air.',
    ],
  },
  {
    date: 'May 4, 2026',
    title: 'A day on Venus is longer than a year on Venus',
    body: [
      'Venus rotates so slowly that a single Venusian day lasts about 243 Earth days, while a full orbit takes only 225. You would complete a trip around the Sun before the Sun had risen and set once.',
      'It also spins backwards relative to most planets. Standing on Venus, if you could see through the clouds, the Sun would rise in the west.',
      'Which makes me wonder about east and west. They are not cosmically meaningful directions — they are just what we call the way our particular planet happens to turn.',
    ],
  },
  {
    date: 'April 29, 2026',
    title: 'The digit 1 leads far more often than it should',
    body: [
      'Take a random collection of real-world numbers — city populations, river lengths, stock prices, physical constants — and about 30% begin with 1. Only 4.6% begin with 9. This is Benford’s Law, and it holds across an astonishing range of data.',
      'The reason is that going from 1 to 2 requires a 100% increase, while going from 8 to 9 requires 12.5%. Any system growing by percentages spends more time with a small leading digit on the way up.',
      'Forensic accountants use this to catch fraud. Fabricated numbers tend to be uniformly distributed, because humans have no intuition for logarithmic distributions. The universe does.',
    ],
  },
  {
    date: 'April 24, 2026',
    title: 'You are made of star stuff, and also of the Big Bang',
    body: [
      'Most of the carbon, oxygen, nitrogen and iron in your body was forged inside stars that died billions of years before the solar system existed. That part is well known.',
      'But the hydrogen — about 60% of your atoms by count — was made in the Big Bang itself. The protons in your water molecules are 13.8 billion years old. They have been here since the universe was three minutes old, cycling through stars and nebulae and oceans and other living things before ending up, for now, as part of you.',
      '"For now" is doing a lot of work there. The atoms will scatter. They have been somewhere before and they will be somewhere after. We are an arrangement, not a thing.',
    ],
  },
]

export default function ThoughtsPage() {
  const scope = useReveal<HTMLDivElement>({ stagger: 0.05 })

  return (
    <main className="min-h-screen">
      <FieldLines field="laminar" />

      <div ref={scope} className="mx-auto w-full max-w-2xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Some thoughts!"
          lede="Short pieces about things I found out and could not stop thinking about."
        />

        <div className="mt-20">
          {THOUGHTS.map(thought => (
            <article key={thought.date} data-reveal className="border-t border-border py-12">
              <p data-reveal-child className="caption mb-4">
                {thought.date}
              </p>
              <h2
                data-reveal-child
                className="wght-head font-display text-[length:var(--text-h2)] leading-tight"
              >
                {thought.title}
              </h2>
              <div data-reveal-child className="mt-5 space-y-4 text-muted-foreground">
                {thought.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
