/**
 * Short pieces.
 *
 * Same arrangement as the research entries: the page and the search index read
 * this one file. Newest first.
 */

export type Thought = {
  /** anchor, so search can deep-link to a single piece */
  id: string
  date: string
  title: string
  body: string[]
}

export const THOUGHTS: Thought[] = [
  {
    id: 'nothing-arrives-on-time',
    date: 'July 14, 2026',
    title: 'Nothing arrives on time',
    body: [
      'A polymerase transcribing a gene is not alone on the strand. Others are ahead of it and behind it, on the same track, and they interfere. So the thing I spend my days modelling is a queue.',
      'What surprised me is how little the average tells you. Two queues can move the same number of molecules per hour and feel completely different from the inside, because one of them clears steadily and the other stalls and then rushes. The mean is identical. The waiting times are not.',
      'I think this is why models built on rates so often disappoint. A rate is what is left after you throw the distribution away, and the distribution was the part that was doing the explaining.',
    ],
  },
  {
    id: 'phase-portrait-photograph',
    date: 'June 30, 2026',
    title: 'A phase portrait and a photograph are the same kind of object',
    body: [
      'A photograph takes three dimensions and a stretch of time and flattens all of it onto a plane. A phase portrait takes an entire family of possible histories and does the same. Both work by discarding things.',
      'I had assumed the film minor and the physics were two separate interests that happened to belong to the same person. They meet here. In both cases what makes the image legible is the choice of what to leave out, and in both cases that choice is the whole craft.',
      'A badly chosen projection tells you nothing. A well chosen one looks obvious afterwards, which I suspect is why nobody credits it.',
    ],
  },
  {
    id: 'the-cell-is-crowded',
    date: 'June 12, 2026',
    title: 'The cell is a packed train, not an empty room',
    body: [
      'Every textbook diagram shows a protein drifting through clear fluid. The inside of a cell holds something like three hundred milligrams of macromolecules per millilitre. It is closer to rush hour than to open water.',
      'Nothing should be able to find anything in there. Diffusion slows down badly under that much crowding. And yet the reactions happen, on time, reliably, all day.',
      'Part of the answer is that the crowding is not only an obstacle. Excluded volume pushes molecules together as well as getting in their way, so the thing that should ruin the search is partly what makes it work.',
      'I keep running into this shape of problem, where the difficulty turns out to be load-bearing. I still do not have a good name for it.',
    ],
  },
  {
    id: 'what-colour-is-a-mirror',
    date: 'May 26, 2026',
    title: 'What colour is a mirror?',
    body: [
      'Most people say silver. A perfect mirror has no colour of its own at all. It only shows you what is around it, which is a different thing from being a colour. Put two perfect mirrors face to face and the space between them would be black, since no light could ever leave.',
      'Real mirrors are faintly green. The glass absorbs slightly more red and blue than green, so photograph a mirror tunnel and the reflections drift greener the further back you look.',
      'We look at mirrors every day of our lives and still cannot say what colour they are. I am not sure whether that is a fact about mirrors or about the way we attend to ordinary things.',
    ],
  },
  {
    id: 'mostly-empty-space',
    date: 'May 21, 2026',
    title: 'You are mostly empty space and have never fallen through a floor',
    body: [
      'An atom is almost entirely gap. Take every proton, neutron and electron in every person who has ever lived, remove the space between them, and what remains would fit inside a sugar cube.',
      'You stay on your chair because of the electromagnetic force rather than because of matter. The electrons at your surface push against the electrons at its surface, and that push is the whole of what you feel. Touch is repulsion. You have never made contact with anything.',
      'I have known this for years and it has not changed how a handshake feels, which is either a failure of imagination on my part or a reasonable division of labour between physics and living.',
    ],
  },
  {
    id: 'fold-a-piece-of-paper',
    date: 'May 17, 2026',
    title: 'Fold a piece of paper a hundred and three times',
    body: [
      'Paper is about a tenth of a millimetre thick, and each fold doubles it. Seven folds gets you the thickness of a notebook. Twenty-three reaches a kilometre. Forty-two takes you to the Moon, fifty-one to the Sun. At a hundred and three you have passed the width of the observable universe.',
      'You cannot fold a sheet more than seven or eight times in practice. The arithmetic has no opinion about that.',
      'I want to say something here about how bad we are at exponential growth, but the honest version is narrower: I was bad at this one, and I had the numbers in front of me the whole time.',
    ],
  },
  {
    id: 'more-chess-games-than-atoms',
    date: 'May 13, 2026',
    title: 'There are more chess games than atoms',
    body: [
      'There are around 10⁸⁰ atoms in the observable universe and something like 10¹²⁰ possible chess games, which is Shannon’s estimate. The ways of playing one game outnumber the contents of everything we can see.',
      'The practical consequence is that almost any long game you play leaves the known positions early. After a dozen moves or so you are somewhere nobody has been and very likely nobody will be again.',
      'A small set of rules generates a space that the physical universe cannot fit inside. I find that unsettling more than impressive, and I have not managed to talk myself out of the feeling.',
    ],
  },
  {
    id: 'the-sun-is-white',
    date: 'May 9, 2026',
    title: 'The Sun is white',
    body: [
      'Its output peaks around five hundred nanometres, a blue-green, but spread broadly enough across the visible range that the sum of it is white. Not yellow.',
      'We see yellow because the atmosphere scatters the short wavelengths sideways, which is the same reason the sky is blue. Near sunrise the light crosses more air, loses more of the blue and green, and what reaches us is red. Astronauts above the atmosphere see the white version.',
      'Every drawing I made as a child had a yellow circle in the corner. So did everyone else’s. We built a shared visual convention on top of a colour that only exists at the bottom of an ocean of air.',
    ],
  },
  {
    id: 'a-day-on-venus',
    date: 'May 4, 2026',
    title: 'A day on Venus is longer than its year',
    body: [
      'Venus turns so slowly that one rotation takes about 243 Earth days, while a full orbit takes 225. You would finish the trip around the Sun before the Sun had finished rising and setting once.',
      'It also spins backwards relative to most of the solar system, so if the clouds ever cleared, the Sun would come up in the west.',
      'Which makes me think east and west are not really directions. They are names for the way one particular planet happens to turn, and we have been using them as though they meant something larger.',
    ],
  },
  {
    id: 'benfords-law',
    date: 'April 29, 2026',
    title: 'The digit 1 goes first more often than it should',
    body: [
      'Gather real-world numbers, city populations or river lengths or physical constants, and roughly thirty per cent of them begin with 1. Only about five per cent begin with 9. This is Benford’s law and it holds across a startling range of data.',
      'The reason is that getting from 1 to 2 takes a doubling while getting from 8 to 9 takes an eighth. Anything growing by percentages spends more of its life with a small leading digit, so that is where you find it when you look.',
      'Forensic accountants use this to catch fabricated figures, which come out too evenly spread. We invent numbers the way we imagine numbers behave, and we imagine them behaving linearly.',
    ],
  },
  {
    id: 'star-stuff',
    date: 'April 24, 2026',
    title: 'Older than the solar system',
    body: [
      'The carbon, oxygen, nitrogen and iron in your body were made inside stars that died before the Sun existed. That part is well known enough to be a cliché.',
      'The hydrogen is older. It is about sixty per cent of your atoms by count and it was made in the first few minutes after the Big Bang. The protons in the water you drank this morning have been around for 13.8 billion years, passing through stars and clouds and oceans and other living things on the way to being briefly part of you.',
      'They will scatter again. We are an arrangement rather than a thing, and not a very long-lived one.',
    ],
  },
]
