/**
 * Short pieces, newest first. Same arrangement as the research entries: the
 * page and the search index read this one file.
 *
 * House style: open on something concrete, follow one thread, name the effect
 * or the study where there is one, and stop before the moral. Where a well
 * known story turns out shakier than its retelling, say so. No em dashes, and
 * watch the last line of every piece: that is where a landing gets smuggled in.
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
    id: 'a-new-order-every-shuffle',
    date: 'October 10, 2026',
    title: 'Shuffle a deck and nobody has seen it before',
    body: [
      'A deck of 52 cards can be put in order in [[factorial|52 factorial]] ways. Written out, that is roughly an 8 followed by 67 zeros.',
      'Suppose all eight billion of us had shuffled one deck every second since the Big Bang. Together we would have dealt a number of orderings that is 28 digits long. The number of possible orderings is 68 digits long, so we would have barely started.',
      'This means a properly shuffled deck is almost certainly in an order no deck has been in before.',
      'The word carrying the weight there is "properly". In 1992 Dave Bayer and Persi Diaconis showed that it takes about seven riffle shuffles to mix a deck. I usually stop at three, which leaves whole runs of the last game sitting where they were.',
    ],
  },
  {
    id: 'the-great-wall-from-space',
    date: 'September 27, 2026',
    title: 'Can you see the Great Wall from space?',
    body: [
      'The claim is older than spaceflight. In 1932 a Ripley\'s Believe It or Not cartoon called the Great Wall the only man-made thing visible from the Moon, decades before anyone could go and look.',
      'From the Moon the whole Earth is about as wide as your thumb held at arm\'s length. Nothing anyone has built shows up at that size.',
      'From [[low-earth-orbit|low orbit]], about 400 kilometres up, it is still very hard. The wall is long, but being long does not help. Width is what the eye needs, and the wall is only five to ten metres wide, which from that height is like picking out a single hair from across a room. It is also made of the local stone and earth, so it is the same colour as the hills under it.',
      'In 2003 Yang Liwei, the first Chinese astronaut, came home and said he had not seen it. Motorways and airport runways are easier, because they are wider and they contrast with the ground. Cities at night are easier still.',
    ],
  },
  {
    id: 'how-long-is-a-coastline',
    date: 'September 19, 2026',
    title: 'Nobody knows how long the coast of Britain is',
    body: [
      'Lewis Fry Richardson was a pacifist who wanted to know whether countries with longer shared borders fought more wars. For that he needed the lengths of the borders. He found the one between Spain and Portugal listed as 987 kilometres in one reference book and 1,214 in another.',
      'Neither book had made a mistake. A border that follows rivers and ridges wiggles, and a shorter ruler follows more of the wiggles. Step around the coast of Britain with a 100 kilometre ruler and you get about 2,800 kilometres. With a 50 kilometre ruler it comes to about 3,400.',
      'It never settles. Each time the ruler shrinks there are smaller bays to go around, then rocks, then pebbles, and the total keeps climbing. Benoit Mandelbrot picked the problem up in 1967, and the [[coastline-paradox|coastline paradox]] became one of the starting points for fractals.',
      'So a coastline length only means something next to the ruler that measured it. Atlases print the first number and almost never the second.',
    ],
  },
  {
    id: 'a-day-is-not-24-hours',
    date: 'September 6, 2026',
    title: 'A day is not 24 hours long',
    body: [
      'The Earth turns once in 23 hours, 56 minutes and 4 seconds. That is a [[sidereal-day|sidereal day]], which is one turn measured against the distant stars.',
      'The missing four minutes come from the orbit. While the Earth turns once it also moves about one degree around the Sun, so the Sun is no longer quite where it was. The planet has to turn a little further to bring it back overhead, and that extra bit takes about four minutes.',
      'Noon to noon is 24 hours, then, but it is slightly more than one turn. Over a year the extra bits add up to one whole turn: the Earth spins about 366 times in 365 days.',
      'You can watch the four minutes go by. Every star rises four minutes earlier than it did the night before, which is two hours over a month. It is why Orion is up on winter evenings and nowhere to be found on summer ones.',
    ],
  },
  {
    id: 'planets-between-here-and-the-moon',
    date: 'August 29, 2026',
    title: 'Do all the planets fit between here and the Moon?',
    body: [
      'There is a picture that goes around of the seven other planets lined up in the gap between the Earth and the Moon, with a little room left over. Jupiter and Saturn are both in there. It looks impossible.',
      'The sum nearly works. Add the average widths of Mercury, Venus, Mars, Jupiter, Saturn, Uranus and Neptune and you get about 380,000 kilometres. The Moon is 384,400 kilometres away on average.',
      'The catch is that the distance runs from the centre of the Earth to the centre of the Moon. Take off the two radii and the gap is about 376,000 kilometres, which is too small. The planets are also wider at the equator than their averages, Saturn most of all.',
      'It can still be done on the right day. The Moon\'s orbit is not a circle, and at [[apogee|its furthest]] it is about 405,500 kilometres away, which leaves room for all seven. At its closest you would have to leave out Uranus or Neptune.',
    ],
  },
  {
    id: 'a-day-longer-than-a-year',
    date: 'August 15, 2026',
    title: 'On Venus a day lasts longer than a year',
    body: [
      'Venus goes around the Sun in about 225 Earth days. It takes 243 to turn once on its axis. The planet finishes a lap of the Sun before it finishes a single spin.',
      'It also spins the other way. Nearly every planet turns in the direction it orbits, and Venus turns [[retrograde-rotation|backwards]]. At its equator the ground moves at about 6.5 kilometres an hour, which is a brisk walk.',
      'The backwards spin changes what a day looks like from the surface. The orbit and the spin work against each other, so sunrise to sunrise takes about 117 Earth days, and the Sun comes up in the west.',
      'So the famous line is true for one meaning of day, the full turn, and false for the other. Counted in sunrises, a Venus year has not quite two days in it.',
      'Nobody is sure why it spins like this. One idea is a very old collision. Another is the slow drag of its own thick atmosphere over billions of years.',
    ],
  },
  {
    id: 'how-much-does-a-cloud-weigh',
    date: 'August 2, 2026',
    title: 'How much does a cloud weigh?',
    body: [
      'Take a small fair-weather cloud, the [[cumulus|cumulus]] kind a child would draw. A reasonable one is about a kilometre wide, a kilometre long and a kilometre tall.',
      'Peggy LeMone, an atmospheric scientist, worked out what is in it. Each cubic metre holds about half a gram of water, which is a few drops. There are a billion cubic metres. That comes to roughly 500 tonnes, or a hundred elephants, drifting over your head.',
      'It stays up because the water is split into droplets about a hundredth of a millimetre across. Something that small falls at around a centimetre a second, and the air under a growing cloud is rising faster than that.',
      'The air in the same box weighs about a million tonnes. By weight the cloud is 99.95 percent air, and everything you can see of it is in the remaining twentieth of a percent.',
    ],
  },
  {
    id: 'the-machine-wants-things',
    date: 'July 18, 2026',
    title: 'We keep saying the machine wants things',
    body: [
      'We see faces in wall sockets and in the fronts of cars. Two dots and a line is enough. The brain has a detector for faces and it would rather fire when there is nothing there than miss one when there is, so it over-fires constantly and we barely notice.',
      'In 1966 Joseph Weizenbaum wrote a program called [[eliza|ELIZA]] that did almost nothing. It took your sentence, turned it around, and handed it back as a question. He watched people confide in it. His own secretary, who knew exactly how it worked because she had watched him build it, asked him to leave the room so she could talk to it in private.',
      'Sixty years later the programs are enormously better at producing sentences, and we have started saying that they want things, that they are trying, that they know. I catch myself doing it several times a day.',
      'I am not sure the reverse claim is any safer. Saying it is only predicting the next word sounds decisive, but I could describe a person that way too, and it would not settle what is going on inside them either.',
      'What I am more confident about is smaller. Weizenbaum\'s secretary knew there was nothing there and asked for the room anyway. Fluency was enough for her, and these are far more fluent than ELIZA was. So my own sense that something is on the other side is not worth much as evidence, whatever turns out to be true.',
    ],
  },
  {
    id: 'how-fast-are-you-moving',
    date: 'July 5, 2026',
    title: 'How fast are you moving, sitting still?',
    body: [
      'If you are near the equator, the ground under you is turning at about 1,600 kilometres an hour. The Earth is going around the Sun at roughly 107,000. The Sun is going around the centre of the galaxy at something like 800,000, and the galaxy itself is falling toward a concentration of mass we cannot see directly and named the [[great-attractor|Great Attractor]].',
      'None of that is felt, because there is nothing to feel. You only notice acceleration, and all of this is steady.',
      'The part I keep returning to is that there is no number to add up. Speed is not a property you have. It is a relationship between you and something you picked, so changing what you measure against changes the answer.',
      'The question has no answer until you say what you are measuring against. Every figure above quietly picked one: the axis, the Sun, the galactic centre, the cosmic microwave background.',
    ],
  },
  {
    id: 'every-generation-thinks-the-next-is-worse',
    date: 'June 21, 2026',
    title: 'Every generation thinks the next one is worse',
    body: [
      'There is a quote that goes around, attributed to Socrates, about how the children now love luxury and have bad manners and contradict their parents. It is a good quote. Socrates did not say it. It comes from a Cambridge dissertation written in 1907, where it was a student paraphrasing several ancient sources at once.',
      'What is funny is that the misattribution proves the point better than the quote would have. We wanted so badly for this complaint to be ancient that we invented an ancient source for it.',
      'The pattern has a name, [[juvenoia|juvenoia]], and the usual explanation is that we compare our memory of being young against our observation of the young. Those are not the same kind of evidence. One is edited and the other is not.',
      'I am about the age where I should start being suspicious of my own opinions on this.',
    ],
  },
  {
    id: 'the-micromort',
    date: 'June 8, 2026',
    title: 'A unit for one in a million',
    body: [
      'Ronald Howard proposed a unit for small risks, because we are hopeless at comparing them in words. One [[micromort|micromort]] is a one in a million chance of dying. It lets you put things next to each other.',
      'Driving a couple of hundred miles is roughly one micromort. A general anaesthetic is somewhere around five. A single skydive is about eight. Living a day as an ordinary adult, with no particular risk taken, costs you something in the region of one anyway, just from existing.',
      'The numbers are estimates and they move around depending on who is counting. The ordering is more stable than the values, and it is not the ordering of our fears: flying comes in below the drive to the airport.',
      'Knowing that has never once made me calmer on a plane.',
    ],
  },
  {
    id: 'the-great-silence',
    date: 'May 24, 2026',
    title: 'The silence is the data',
    body: [
      'There are a few hundred billion stars in this galaxy and the galaxy has been here for a very long time. Even at speeds we can already imagine, something patient could have crossed it many times over. Enrico Fermi is supposed to have asked, over lunch, [[fermi-paradox|where everybody is]].',
      'Every answer I have read is uncomfortable in a different way. Maybe life of our kind is far rarer than it looks. Maybe it is common and does not last. Maybe it is common and lasts and has decided, for reasons we would need to be much older to understand, to be quiet.',
      'What I find hard is that the silence is genuine evidence rather than the absence of a result. We have looked at a small part of the sky for a short time in a narrow band, which is close to nothing. But it is not actually nothing.',
      'I do not have a favourite answer. I notice that the ones I dislike most are the ones I find hardest to argue against.',
    ],
  },
  {
    id: 'a-brain-built-for-a-village',
    date: 'May 11, 2026',
    title: 'A brain built for a village',
    body: [
      'Robin Dunbar noticed that in primates, the size of the neocortex tracks the size of the group, and extrapolated to us. The number that came out was [[dunbar-number|about 150]]: roughly how many people you can hold a real relationship with, meaning you know who they are and how they stand to each other.',
      'It has been widely repeated and it is genuinely contested. A 2021 reanalysis argued the statistics do not support a precise figure at all. So take 150 as a rough shape rather than a measurement.',
      'The shape still seems worth sitting with. Whatever the true number, it is not in the millions, and we now live in arrangements of millions and read the opinions of strangers all day as though they were neighbours.',
      'That may well be perfectly survivable. I just do not think anyone chose it.',
    ],
  },
  {
    id: 'the-planes-that-came-back',
    date: 'April 27, 2026',
    title: 'The planes that came back',
    body: [
      'During the war the American military looked at bombers returning from raids and mapped where they were most often hit. The wings and the fuselage, mostly. The obvious move was to armour those places.',
      'Abraham Wald, working with a group of statisticians in New York, pointed out that they were looking at the wrong aeroplanes. The ones in front of them were the ones that had come back. Damage to the wings was survivable, which is exactly why they were seeing it. The armour belonged where the returning planes had no holes at all, because aircraft hit there were not in the sample.',
      'I like it as a story because the error is not a failure of intelligence. Everyone involved was clever. The data was accurate. The sample had simply been [[survivorship-bias|assembled by the thing being measured]].',
      'I try to ask what would be missing from the evidence if the effect were real. I forget to, most of the time.',
    ],
  },
  {
    id: 'everyone-is-at-the-centre',
    date: 'April 12, 2026',
    title: 'Everyone is at the centre',
    body: [
      'The universe is about 13.8 billion years old, so it would be reasonable to expect that we can see 13.8 billion light years in any direction. The actual figure is closer to 46. Space expanded while the light was in transit, so the objects that emitted the oldest light we receive are now much further away than the light has travelled.',
      'That radius defines an [[observable-universe|observable universe]], and it is centred on you. Not on Earth in any grand sense, just on whoever is doing the looking. Someone far away has their own sphere, overlapping ours, extending into regions we will never receive anything from.',
      'Nothing is out there at that radius. It marks how long light has had to reach us, so it moves outward as time passes, and every observer carries their own.',
    ],
  },
  {
    id: 'thirty-eight-witnesses',
    date: 'March 29, 2026',
    title: 'The story about the thirty-eight witnesses',
    body: [
      'In 1964 Kitty Genovese was murdered in Queens, and the New York Times reported that thirty-eight people had watched and none had called the police. It became one of the most repeated stories in psychology.',
      'Most of it does not hold up. Later work showed the number was inflated, that few had any clear view of what was happening, and that some did call. The paper had a compelling shape and the shape survived better than the facts did.',
      'The awkward part is that the underlying effect is real anyway. Darley and Latané ran controlled experiments afterwards and found it repeatedly: [[bystander-effect|the more people present, the less likely any one of them acts]], because responsibility divides.',
      'So a real finding became famous through a story that was mostly wrong. Both halves are true and I have never found a tidy way to say them in the same breath.',
    ],
  },
]
