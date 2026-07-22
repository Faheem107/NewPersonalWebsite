import { getSubjects } from '@/lib/notes'
import { RESEARCH } from '@/content/research'
import { THOUGHTS } from '@/content/thoughts'
import type { SearchDoc } from '@/lib/search-match'

/**
 * The search index for the whole site.
 *
 * Built once at build time and serialised into the page. Every source it reads
 * is static, so there is nothing to fetch and nothing to keep in sync: adding a
 * note, a research entry or a thought makes it searchable with no change here.
 *
 * Server-only, since getSubjects touches the filesystem. The matcher lives in
 * lib/search-match.ts and is imported directly by the client dialog. Do not
 * re-export it from here, or the client pulls node:fs in behind it.
 */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = []

  for (const subject of getSubjects()) {
    for (const topic of subject.topics) {
      const href = `/notes/${subject.slug}/${topic.slug}`

      docs.push({
        href,
        section: 'Notes',
        title: topic.title,
        context: subject.title,
        body: topic.summary,
      })

      // Headings are indexed without the parent note's title in their
      // searchable text. Including it meant searching "entropy" surfaced every
      // section of "Entropy, Properly", most of which were about something
      // else. A section should match on its own words.
      for (const heading of topic.headings) {
        docs.push({
          href: `${href}#${heading.id}`,
          section: 'Notes',
          title: heading.text,
          context: topic.title,
          nested: true,
        })
      }
    }
  }

  for (const entry of RESEARCH) {
    docs.push({
      href: `/research#${entry.id}`,
      section: 'Research',
      title: entry.title,
      context: `${entry.where} · ${entry.when}`,
      body: entry.body,
    })
  }

  for (const thought of THOUGHTS) {
    docs.push({
      href: `/thoughts#${thought.id}`,
      section: 'Thoughts',
      title: thought.title,
      context: thought.date,
      body: thought.body.join(' '),
    })
  }

  docs.push(
    {
      href: '/',
      section: 'Pages',
      title: 'Home',
      context: 'Physics at NYU Abu Dhabi',
      body: 'faheem physics film mathematics music books movies',
    },
    {
      href: '/research',
      section: 'Pages',
      title: 'Research',
      context: 'Lab work and computational projects',
      body: 'biophysics stochastic transcription condensates modelling oxford cambridge laidlaw igem',
    },
    {
      href: '/photography',
      section: 'Pages',
      title: 'Photography and Films',
      context: 'Photographs, and the films behind them',
      body: 'ninaivu labocine the gazelle photo essays cinema camera',
    },
    {
      href: '/thoughts',
      section: 'Pages',
      title: 'Some thoughts!',
      context: 'Short pieces',
      body: 'essays writing physics curiosity',
    },
    {
      href: '/notes',
      section: 'Pages',
      title: 'Notes',
      context: 'Physics and mathematics from coursework',
      body: 'thermodynamics electromagnetism linear algebra statistical mechanics differential equations',
    },
    {
      href: '/about',
      section: 'Pages',
      title: 'About',
      context: 'Who I am',
      body: 'mohammed faheem nyu abu dhabi physics film new media contact email linkedin github instagram',
    },
  )

  return docs
}
