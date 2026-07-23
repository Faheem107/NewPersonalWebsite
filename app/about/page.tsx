import type { Metadata } from 'next'
import Backdrop from '@/components/backdrop/pattern'
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
      <Backdrop pattern="lattice" />

      <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader title="About" />

        <div className="mt-14 max-w-prose space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I am Mohammed Faheem, a second-year student at NYU Abu Dhabi, studying Physics with a
            minor in Film &amp; New Media. Most of my work uses mathematical and computational tools
            to understand biological systems. Right now that means the stochastic side of
            transcription.
          </p>
          <p>
            Alongside classes and lab work I spend a lot of time explaining things, in writing and
            in pictures. Putting an idea into a second form is the clearest way I have found to
            understand it properly, which is most of why I keep doing it.
          </p>
          <p>
            I also keep coming back to the question of what a piece of research is for, which the
            results do not settle on their own. I would rather hold that question open than answer
            it too quickly.
          </p>
          <p>
            Away from all that, I play football and read a good deal. If any of this overlaps with
            what you are working on, I would be glad to hear from you.
          </p>
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
