'use client'

import FieldLines from '@/components/backdrop/field-lines'
import PageHeader from '@/components/page-header'
import { useReveal } from '@/lib/motion/use-reveal'

const RESEARCH = [
  {
    title: 'Laidlaw Research Scholar',
    where: 'Laidlaw Foundation',
    when: 'Mar 2026 — present',
    body: 'Independent research funded by the Laidlaw Foundation on the diffusive queueing dynamics of mRNA transcription. I am developing stochastic models to test activation signatures in single-molecule transcription data.',
  },
  {
    title: 'Biophysics Research Assistant',
    where: 'University of Cambridge',
    when: 'Jul — Aug 2025',
    body: 'Analysed microscopy data to understand instability in cortical condensates within C. elegans oocytes. Over the summer of 2025 I extended the work at Cambridge, studying the mathematics of resource competition in soft matter and improving dry-lab workflows.',
  },
  {
    title: 'Computational Biology & iGEM',
    where: 'NYU Abu Dhabi',
    when: 'Dec 2025 — present',
    body: 'Dry lab and education team for the university iGEM team. I build computational tools for synthetic biology research and organise outreach ahead of the iGEM 2026 conference in Paris.',
  },
  {
    title: 'Bioinformatics Intern',
    where: 'Harmonic Discovery',
    when: 'Oct 2025 — Feb 2026',
    body: 'Organised biological datasets for therapeutic drug design, and ran testing pipelines to analyse protein docking efficiency and estimate binding affinities across ligands.',
  },
  {
    title: 'Biomathematics Research',
    where: 'NYU Abu Dhabi',
    when: 'Aug — Dec 2025',
    body: 'Worked under Professor Mazin Magzoub on the probabilistic nature of RNA splicing, developing computational methods to characterise RNA exon activity.',
  },
  {
    title: 'Image Processing & Dynamics Intern',
    where: 'Czech Academy of Sciences',
    when: 'Jun — Jul 2025',
    body: 'Designed a Fiji and ilastik pipeline to highlight protein dynamics in actomyosin cortex activation, allowing simultaneous tracking and processing of live-cell datasets.',
  },
]

export default function ResearchPage() {
  const scope = useReveal<HTMLDivElement>()

  return (
    <main className="min-h-screen">
      {/* flow past a body — the figure a fluid-dynamics paper opens with */}
      <FieldLines field="dipole" />

      <div ref={scope} className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Research"
          lede="Lab work and computational projects, most recently on the stochastic behaviour of transcription."
        />

        <div className="mt-20">
          {RESEARCH.map(item => (
            <article
              key={item.title}
              data-reveal
              className="grid gap-x-8 gap-y-3 border-t border-border py-10 md:grid-cols-[var(--rail)_1fr]"
            >
              {/* The rail carries when and where. Both were pill badges before —
                  chrome standing in for information that position can encode. */}
              <div data-reveal-child className="caption pt-1.5 md:text-right">
                {item.when}
              </div>

              <div data-reveal-child>
                <h2 className="wght-head font-display text-[length:var(--text-h2)]">{item.title}</h2>
                <p className="caption mt-2">{item.where}</p>
                <p className="mt-4 max-w-prose text-muted-foreground">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
