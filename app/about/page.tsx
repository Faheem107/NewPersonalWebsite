import type { Metadata } from 'next'
import Wash from '@/components/backdrop/wash'
import PageHeader from '@/components/page-header'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mohammed Faheem, Physics major with a Film & New Media minor at NYU Abu Dhabi.',
}

const FACTS = [
  { label: 'Location', value: 'Abu Dhabi, UAE' },
  { label: 'Major', value: 'Physics, with Film & New Media' },
  { label: 'University', value: 'NYU Abu Dhabi' },
]

const LINKS = [
  { label: 'Email', href: 'mailto:mj3398@nyu.edu' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohammed-faheem-33bb49295' },
  { label: 'Instagram', href: 'https://instagram.com/faheemmmm._' },
  { label: 'GitHub', href: 'https://github.com/Faheem107' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Wash variant="saddle" />

      <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader title="About" />

        <div className="mt-14 max-w-prose space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I am Mohammed Faheem, a student at NYU Abu Dhabi majoring in Physics with a minor in
            Film &amp; New Media. Most of my work is an attempt to use mathematics and computation
            to understand biological systems, at the moment the stochastic behaviour of
            transcription.
          </p>
          <p>
            Alongside the coursework and the lab I spend a good deal of time on science
            communication and on visual work. I have come to think that an idea is not really
            understood until it can survive being explained in more than one medium, and that the
            question of what a piece of research is for matters at least as much as whether it is
            correct.
          </p>
          <p>
            I am not sure I have settled either question. What I am fairly sure of is that the
            answer is not something you arrive at once and then keep. It is closer to something you
            have to keep asking, and the asking is most of the work.
          </p>
          <p>Outside of all that, football and reading.</p>
        </div>

        <section className="mt-20 border-t border-border pt-8">
          <h2 className="caption mb-8">At a glance</h2>
          <dl className="grid gap-8 sm:grid-cols-3">
            {FACTS.map(fact => (
              <div key={fact.label}>
                <dt className="caption mb-2">{fact.label}</dt>
                <dd className="font-display text-lg leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 border-t border-border pt-8">
          <h2 className="caption mb-6">Get in touch</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="rule-link wght-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
