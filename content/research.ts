/**
 * Research entries.
 *
 * Lives here rather than inside the page so the search index and the page read
 * the same source. Anything added here is searchable with no further work.
 *
 * Ordered by start date, most recent first.
 */

export type ResearchEntry = {
  /** anchor, so search can deep-link to a single entry */
  id: string
  title: string
  where: string
  when: string
  body: string
}

export const RESEARCH: ResearchEntry[] = [
  {
    id: 'oxford-soft-matter',
    title: 'Research Intern, Soft-Condensed Matter',
    where: 'University of Oxford',
    when: 'Jun 2026 to present',
    body: 'Building a mathematical framework for diffusive search inside crowded cells. The question is how a molecule finds its target at all when the space it has to cross is packed with everything else, and whether the crowding that seems like an obstacle is doing something useful.',
  },
  {
    id: 'laidlaw-scholar',
    title: 'Research Scholar',
    where: 'Laidlaw Foundation',
    when: 'Mar 2026 to present',
    body: 'Part of the first cohort of Laidlaw Scholars from NYU, with a grant to work independently on the queueing dynamics of mRNA transcription. I am building stochastic models to test for non-monotonic activation signatures in single-molecule data, which is a long way of saying I am trying to work out whether an effect is really there.',
  },
  {
    id: 'ebrain-lab',
    title: 'Research Assistant, eBrain Lab',
    where: 'NYU Abu Dhabi',
    when: 'Jan 2026 to present',
    body: 'Fine-tuning pretrained language models for quantum chemistry, and building pipelines that predict molecular states before anything is synthesised. Most of my time goes on the cases the models get wrong, which is where there is anything to learn.',
  },
  {
    id: 'igem-nyuad',
    title: 'Dry Lab and Education, iGEM',
    where: 'NYU Abu Dhabi',
    when: 'Dec 2025 to present',
    body: 'Computational tools and outreach for the university iGEM team, ahead of the 2026 conference in Paris. Half of the work is modelling and half is explaining, and I have come round to thinking the second half is not the easier one.',
  },
  {
    id: 'rna-splicing',
    title: 'Biomathematics Research',
    where: 'NYU Abu Dhabi',
    when: 'Aug to Dec 2025',
    body: 'Worked with Professor Mazin Magzoub on the probabilistic nature of RNA splicing, developing computational methods to characterise exon activity. It was the first time I had to sit with a result that stayed ambiguous however I looked at it.',
  },
  {
    id: 'cambridge-theoretical',
    title: 'Research Intern, Theoretical Physics',
    where: 'University of Cambridge',
    when: 'Jul to Aug 2025',
    body: 'An independent project on resource competition driving criticality in soft matter, working from C. elegans oocytes and asking how the structure of the cortex relates to hyperuniformity. I also spent a good deal of it rewriting the dry-lab pipeline, which was less glamorous and probably more useful.',
  },
  {
    id: 'czech-academy',
    title: 'Research Intern, Image Processing',
    where: 'Institute of Molecular Genetics, Czech Academy of Sciences',
    when: 'Jun to Jul 2025',
    body: 'Designed a Fiji and ilastik pipeline to plot phase portraits of protein dynamics during actomyosin cortex activation, with segmentation and track analysis across more than fifty live-cell datasets. It was the first time I had watched a piece of mathematics turn up in footage of something alive.',
  },
  {
    id: 'nyuad-biophysics',
    title: 'Biophysics Research Assistant',
    where: 'NYU Abu Dhabi',
    when: 'Oct 2024 to present',
    body: 'Quantitative analysis of stochastic instability in cortical condensates in C. elegans oocytes, from time-series microscopy. Over a thousand condensate trajectories, characterising noise-driven transitions in active matter. Most of them look like nothing until you have seen enough of them.',
  },
]
