import type { Metadata } from 'next'
import Backdrop from '@/components/backdrop/pattern'
import Gloss from '@/components/gloss'
import PageHeader from '@/components/page-header'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mohammed Faheem, a third-year Physics student at NYU Abu Dhabi with a Film & New Media minor.',
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
    <main className="min-h-[100svh]">
      <Backdrop pattern="lattice" />

      <div className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader title="About" />

        <div className="mt-14 max-w-prose space-y-6 text-lg leading-relaxed text-muted-foreground">
          {/* Three terms, and no more: this is the first paragraph anyone
              reads, and a sentence carrying five dotted underlines stops being
              a sentence. "Transcription" is the one that matters, because it is
              the hand-off to the research page. */}
          <p>
            I am Mohammed Faheem. I am in my third year at{' '}
            <Gloss entryKey="nyuad">NYU Abu Dhabi</Gloss>, studying Physics with a minor in{' '}
            <Gloss entryKey="film-new-media">Film &amp; New Media</Gloss>. Most of what I do is
            pointing maths and code at biology problems, which at the moment means the random side
            of <Gloss entryKey="transcription">transcription</Gloss>.
          </p>
          <p>
            Between classes and lab work I spend a lot of time explaining things, in writing and in
            pictures. I do it because I find out what I have not actually understood the moment I
            try to put it into a second form.
          </p>
          <p>
            I also keep coming back to what a piece of research is for, which the results never
            seem to settle on their own. I do not have a good answer yet and I would rather not
            force one.
          </p>
          <p>
            Outside of that I play football and read. If any of this overlaps with what you are
            working on, I would be glad to hear from you.
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
