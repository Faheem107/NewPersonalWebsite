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
            minor in Film &amp; New Media. Most of what I do is trying to use a bit of maths and
            computation to make slightly more sense of biological systems. Right now that means the
            stochastic side of transcription, which I am still very much finding my way around.
          </p>
          <p>
            Alongside classes and lab work I spend a lot of time explaining things, in writing and
            in pictures. I mostly do it for selfish reasons: putting an idea into a second form is
            the quickest way I know to catch the parts I only thought I had understood. I get those
            parts wrong often enough that it has stopped surprising me.
          </p>
          <p>
            I also keep coming back to the question of what a given piece of research is actually
            for, which the results never seem to answer on their own. I do not have a good answer to
            that yet, and I would rather sit with the question than pretend I do.
          </p>
          <p>
            Away from all that I play football and read more than is probably good for me. If any of
            this lines up with something you are working on, I would be really glad to hear from you.
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
