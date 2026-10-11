/**
 * The glossary. One entry per term that earns an explanation, keyed by a slug.
 * Prose refers to one with `[[key]]` or `[[key|words as they read here]]`.
 *
 * Three fields, three questions: `short` is what it is, in two sentences at
 * most; `href` is where the real thing lives off-site; `see` is where this site
 * says more, which is the reason for one shared glossary rather than notes
 * written per page.
 */

export type GlossEntry = {
  /** heading of the box; usually the canonical form of the term */
  term: string
  /** one or two plain sentences */
  short: string
  /** the real thing, off this site */
  href?: string
  /** what that link is, so the box does not just show a bare URL */
  hrefLabel?: string
  /** somewhere on this site that carries more */
  see?: { href: string; label: string }
}

export const GLOSSARY: Record<string, GlossEntry> = {
  // places and people
  'gene-machines': {
    term: 'Gene Machines, Oxford',
    short:
      'A biological physics group in Oxford\'s Condensed Matter Physics, working on the machinery that reads DNA and watching it one molecule at a time.',
    href: 'https://kapanidis.web.ox.ac.uk/',
    hrefLabel: 'The group',
  },
  cambridge: {
    term: 'University of Cambridge',
    short:
      'A summer internship in theoretical physics, on soft matter in living cells.',
  },
  laidlaw: {
    term: 'The Laidlaw Foundation',
    short:
      'Funds undergraduates at a set of universities to run a research project of their own choosing, alongside leadership training.',
    href: 'https://laidlawfoundation.com/the-laidlaw-scholars-leadership-research-programme/',
    hrefLabel: 'The programme',
  },
  'ebrain-lab': {
    term: 'eBrain Lab',
    short:
      'Muhammad Shafique\'s lab in the engineering division at NYU Abu Dhabi, working on energy-efficient and brain-inspired machine learning.',
    href: 'https://ebrain4everyone.com/',
    hrefLabel: 'The lab',
  },
  img: {
    term: 'Institute of Molecular Genetics',
    short:
      'A Czech Academy of Sciences institute in Prague, working on how cells and tissues develop at the molecular level.',
    href: 'https://www.img.cas.cz/en/',
    hrefLabel: 'The institute',
  },
  magzoub: {
    term: 'Mazin Magzoub',
    short:
      'Associate Professor of Biology at NYU Abu Dhabi. His lab works on protein aggregation and on getting therapeutics into cells.',
    href: 'https://nyuad.nyu.edu/en/academics/divisions/science/faculty/mazin-magzoub.html',
    hrefLabel: 'His faculty page',
  },
  igem: {
    term: 'iGEM',
    short:
      'An international synthetic biology competition for student teams, ending in a jamboree where every team presents what it built that year.',
    href: 'https://competition.igem.org/about',
    hrefLabel: 'The competition',
  },
  nyuad: {
    term: 'NYU Abu Dhabi',
    short:
      'One of NYU\'s three degree-granting campuses, on Saadiyat Island in Abu Dhabi. Where I study, and where most of the work on this site started.',
    href: 'https://nyuad.nyu.edu/',
    hrefLabel: 'The university',
  },
  'film-new-media': {
    term: 'Film & New Media',
    short:
      'The film minor at NYU Abu Dhabi: production and theory together, rather than one or the other.',
    see: { href: '/photography', label: 'What has come out of it' },
  },

  // things in the work
  transcription: {
    term: 'Transcription',
    short:
      'The step where a stretch of DNA is copied into RNA. It happens in uneven bursts rather than at a steady rate, which is the part I work on.',
    see: { href: '/research#laidlaw-scholar', label: 'The project on it' },
  },
  poisson: {
    term: 'A Poisson process',
    short:
      'The model for events that happen independently at a constant average rate, like clicks on a Geiger counter. Transcription is not one, because polymerases interfere with each other.',
    see: {
      href: '/notes/statistical-mechanics/probability-distributions',
      label: 'The note on distributions',
    },
  },
  hyperuniform: {
    term: 'Hyperuniformity',
    short:
      'An arrangement that looks disordered close up but suppresses variation in density at large scales. It sits between a crystal and a random scatter.',
  },
  'cortical-condensates': {
    term: 'Cortical condensates',
    short:
      'Droplets of protein that form by separating out of the cytoplasm, near the inner surface of a cell. They appear and dissolve on their own, without a membrane holding them together.',
    see: { href: '/research#nyuad-biophysics', label: 'Where I measure them' },
  },
  'actomyosin-cortex': {
    term: 'The actomyosin cortex',
    short:
      'A thin layer of filaments and motors just under a cell\'s membrane. It contracts, and most of a cell\'s changes in shape come from it.',
  },
  ilastik: {
    term: 'Fiji and ilastik',
    short:
      'Two open tools for microscopy images: Fiji for handling and measuring them, ilastik for training a classifier to pick out the things you care about.',
    href: 'https://www.ilastik.org/',
    hrefLabel: 'ilastik',
  },
  'crowded-cell': {
    term: 'Macromolecular crowding',
    short:
      'The cytoplasm is roughly thirty percent occupied by other molecules, so nothing diffuses through it the way it would through water.',
  },

  // things in the thoughts
  factorial: {
    term: 'Factorial',
    short:
      'A whole number multiplied by every whole number below it, written with an exclamation mark. It counts the ways of putting that many things in order.',
  },
  'low-earth-orbit': {
    term: 'Low Earth orbit',
    short:
      'Orbits up to about 2,000 kilometres above the ground. The International Space Station flies at roughly 400, and almost everyone who has been to space went no higher.',
  },
  'coastline-paradox': {
    term: 'The coastline paradox',
    short:
      'A coastline has no single length, because the answer grows as the ruler shrinks. Lewis Fry Richardson found it and Benoit Mandelbrot made it well known.',
  },
  'sidereal-day': {
    term: 'The sidereal day',
    short:
      'One full turn of the Earth measured against the distant stars: 23 hours, 56 minutes and 4 seconds. The 24 hour day is measured against the Sun instead.',
  },
  'friendship-paradox': {
    term: 'The friendship paradox',
    short:
      'On average your friends have more friends than you do, because sociable people appear in more lists of friends. Scott Feld described it in 1991.',
  },
  'birthday-problem': {
    term: 'The birthday problem',
    short:
      'How many people you need before two of them probably share a birthday. The answer is 23, because what grows quickly is the number of pairs.',
  },
  cumulus: {
    term: 'Cumulus',
    short:
      'The puffy, flat-bottomed cloud of a fair day. It forms where a column of warm air rises and cools until its water vapour condenses.',
  },
  eliza: {
    term: 'ELIZA',
    short:
      'Joseph Weizenbaum\'s 1966 program, which turned your sentence around and handed it back as a question. It was a few pages of pattern matching and people confided in it anyway.',
  },
  juvenoia: {
    term: 'Juvenoia',
    short:
      'The recurring conviction that the young are worse than they used to be. David Finkelhor coined the word for it.',
  },
  micromort: {
    term: 'The micromort',
    short:
      'A unit for small risks, proposed by Ronald Howard: one micromort is a one in a million chance of dying. It exists so that risks can be put side by side.',
  },
  'great-attractor': {
    term: 'The Great Attractor',
    short:
      'A concentration of mass that our whole local group of galaxies is falling toward. We cannot see it directly, because the disc of the Milky Way sits in the way.',
  },
  'dunbar-number': {
    term: "Dunbar's number",
    short:
      'About 150, the group size Robin Dunbar extrapolated from the relationship between neocortex and group size in primates. A 2021 reanalysis argued the data does not support a precise figure.',
  },
  'survivorship-bias': {
    term: 'Survivorship bias',
    short:
      'What happens when the sample you can see has already been filtered by the thing you are trying to measure. The evidence looks complete and is not.',
  },
  'bystander-effect': {
    term: 'The bystander effect',
    short:
      'The more people present, the less likely any one of them acts, because responsibility divides. Darley and Latane established it in controlled experiments.',
  },
  'observable-universe': {
    term: 'The observable universe',
    short:
      'Everything close enough that its light has had time to reach us. It is a statement about how long light has been travelling, not about where anything ends.',
  },
  'fermi-paradox': {
    term: "Fermi's question",
    short:
      'The galaxy is old and large and something patient could have crossed it many times by now, so the quiet is itself surprising. Fermi is supposed to have asked it over lunch.',
  },
}
