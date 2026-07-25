/**
 * Research entries.
 *
 * Lives here rather than inside the page so the search index and the page read
 * the same source. Anything added here is searchable with no further work.
 *
 * Ordered by start date, most recent first.
 *
 * House style: say what the work is and what is still open in it. Titles and
 * institutions are facts and stay; anything that was doing the job of a
 * credential ("first cohort", "independently") has been taken out, because the
 * rail already carries the date and the reader can weigh the rest themselves.
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
    where: '[[gene-machines|University of Oxford]]',
    when: 'Jun 2026 to present',
    body: 'Working on how a molecule finds its binding site inside a cell that is already [[crowded-cell|about thirty percent full of other molecules]]. The crowding slows diffusion down, but it also keeps the search inside a smaller space, so it is not obvious which of the two wins. I am trying to find the conditions where the second one does.',
  },
  {
    id: 'laidlaw-scholar',
    title: 'Research Scholar',
    where: '[[laidlaw|Laidlaw Foundation]]',
    when: 'Mar 2026 to present',
    body: 'A Laidlaw grant to spend a year on the queueing dynamics of mRNA transcription. Polymerases loading onto a gene get in each other\'s way, so the bursts that come out are not [[poisson|Poisson]]. I am fitting stochastic models to single-molecule data to see whether the non-monotonic activation they predict is actually there.',
  },
  {
    id: 'ebrain-lab',
    title: 'Research Assistant, eBrain Lab',
    where: '[[ebrain-lab|eBrain Lab]], NYU Abu Dhabi',
    when: 'Jan 2026 to present',
    body: 'Fine-tuning pretrained language models on quantum chemistry, and building pipelines that predict molecular states before anything is synthesised. Most of my time goes on the cases where it gets things wrong, and on telling apart the ones that are the model from the ones that are the training data.',
  },
  {
    id: 'igem-nyuad',
    title: 'Dry Lab and Education, iGEM',
    where: 'NYU Abu Dhabi',
    when: 'Dec 2025 to present',
    body: 'Computational tools and outreach for the university [[igem]] team, ahead of the 2026 conference in Paris. About half of it is modelling and half is explaining the modelling, to judges and to school students. The explaining is the harder half.',
  },
  {
    id: 'rna-splicing',
    title: 'Biomathematics Research',
    where: 'NYU Abu Dhabi',
    when: 'Aug to Dec 2025',
    body: 'Worked with Professor [[magzoub|Mazin Magzoub]] on how probabilistic RNA splicing is, writing code to characterise exon activity. The result stayed ambiguous under every analysis I tried. Reporting that, rather than going back for a cleaner one, was the part I found hardest.',
  },
  {
    id: 'cambridge-theoretical',
    title: 'Research Intern, Theoretical Physics',
    where: '[[cambridge|University of Cambridge]]',
    when: 'Jul to Aug 2025',
    body: 'A summer project on whether competition for resources can push soft matter to criticality, working from C. elegans oocytes and asking whether the [[cortical-condensates|cortical condensates]] are arranged [[hyperuniform|hyperuniformly]]. Much of the summer went on rewriting the dry-lab pipeline instead, which was probably more use to the group than what I had gone there to do.',
  },
  {
    id: 'czech-academy',
    title: 'Research Intern, Image Processing',
    where: '[[img|Institute of Molecular Genetics]], Czech Academy of Sciences',
    when: 'Jun to Jul 2025',
    body: 'Put together a [[ilastik|Fiji and ilastik]] pipeline to plot phase portraits of protein dynamics during [[actomyosin-cortex|actomyosin cortex]] activation, with segmentation and track analysis across about fifty live-cell datasets.',
  },
  {
    id: 'nyuad-biophysics',
    title: 'Biophysics Research Assistant',
    where: 'NYU Abu Dhabi',
    when: 'Oct 2024 to present',
    body: 'Measuring how unstable [[cortical-condensates|cortical condensates]] are in C. elegans oocytes, from time-series microscopy. It came to something like a thousand trajectories, looking for transitions driven by noise rather than by anything in particular. This is where I started, and most of what I can actually do came out of it.',
  },
]
