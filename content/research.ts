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
    body: 'Building a mathematical framework for diffusive search in crowded cells. A molecule looking for its binding site has to cross a cytoplasm that is roughly thirty percent occupied by other macromolecules, which slows diffusion but also confines the search. Whether the second effect can outweigh the first is what I am trying to characterise.',
  },
  {
    id: 'laidlaw-scholar',
    title: 'Research Scholar',
    where: 'Laidlaw Foundation',
    when: 'Mar 2026 to present',
    body: 'Part of the first cohort of Laidlaw Scholars from NYU, with a grant to work independently on the queueing dynamics of mRNA transcription. Polymerases loading onto a gene interfere with each other, and the resulting bursts do not look like a Poisson process. I am fitting stochastic models to single-molecule data to test whether the non-monotonic activation they predict is actually present.',
  },
  {
    id: 'ebrain-lab',
    title: 'Research Assistant, eBrain Lab',
    where: 'NYU Abu Dhabi',
    when: 'Jan 2026 to present',
    body: 'Fine-tuning pretrained language models for quantum chemistry, and building pipelines that predict molecular states before anything is synthesised. Most of my time goes on the failure cases, and on working out which of them are the model and which are the training set.',
  },
  {
    id: 'igem-nyuad',
    title: 'Dry Lab and Education, iGEM',
    where: 'NYU Abu Dhabi',
    when: 'Dec 2025 to present',
    body: 'Computational tools and outreach for the university iGEM team, ahead of the 2026 conference in Paris. Roughly half modelling and half explaining the modelling, to judges and to secondary school students who have no reason to care yet.',
  },
  {
    id: 'rna-splicing',
    title: 'Biomathematics Research',
    where: 'NYU Abu Dhabi',
    when: 'Aug to Dec 2025',
    body: 'Worked with Professor Mazin Magzoub on the probabilistic nature of RNA splicing, developing computational methods to characterise exon activity. The result stayed ambiguous under every analysis I tried, and learning to report that rather than keep looking for a cleaner one was most of what I took from it.',
  },
  {
    id: 'cambridge-theoretical',
    title: 'Research Intern, Theoretical Physics',
    where: 'University of Cambridge',
    when: 'Jul to Aug 2025',
    body: 'An independent project on resource competition driving criticality in soft matter, working from C. elegans oocytes and asking whether the arrangement of cortical condensates is hyperuniform. A good deal of the summer went on rewriting the dry-lab pipeline instead, which was the more useful of the two contributions.',
  },
  {
    id: 'czech-academy',
    title: 'Research Intern, Image Processing',
    where: 'Institute of Molecular Genetics, Czech Academy of Sciences',
    when: 'Jun to Jul 2025',
    body: 'Designed a Fiji and ilastik pipeline to plot phase portraits of protein dynamics during actomyosin cortex activation, with segmentation and track analysis across more than fifty live-cell datasets.',
  },
  {
    id: 'nyuad-biophysics',
    title: 'Biophysics Research Assistant',
    where: 'NYU Abu Dhabi',
    when: 'Oct 2024 to present',
    body: 'Quantitative analysis of stochastic instability in cortical condensates in C. elegans oocytes, from time-series microscopy. Over a thousand condensate trajectories, characterising noise-driven transitions in active matter.',
  },
]
