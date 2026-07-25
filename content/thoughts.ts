/**
 * Short pieces.
 *
 * Same arrangement as the research entries: the page and the search index read
 * this one file. Newest first.
 *
 * House style, since it is easy to drift: open on something concrete, follow
 * one thread, name the effect or the study where there is one, and stop before
 * the moral. Where a well-known story turns out to be shakier than its
 * retelling, say so. No em dashes.
 *
 * Watch the last line of every piece in particular. That is where a landing
 * gets smuggled in, and a landing is the thing that makes writing sound like it
 * was performed rather than thought. Finish the thought and stop.
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
    id: 'the-machine-wants-things',
    date: 'July 18, 2026',
    title: 'We keep saying the machine wants things',
    body: [
      'We see faces in wall sockets and in the fronts of cars. Two dots and a line is enough. The brain has a detector for faces and it would rather fire when there is nothing there than miss one when there is, so it over-fires constantly and we barely notice.',
      'In 1966 Joseph Weizenbaum wrote a program called ELIZA that did almost nothing. It took your sentence, turned it around, and handed it back as a question. He watched people confide in it. His own secretary, who knew exactly how it worked because she had watched him build it, asked him to leave the room so she could talk to it in private.',
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
      'If you are near the equator, the ground under you is turning at about 1,600 kilometres an hour. The Earth is going around the Sun at roughly 107,000. The Sun is going around the centre of the galaxy at something like 800,000, and the galaxy itself is falling toward a concentration of mass we cannot see directly and named the Great Attractor.',
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
      'The pattern has a name, juvenoia, and the usual explanation is that we compare our memory of being young against our observation of the young. Those are not the same kind of evidence. One is edited and the other is not.',
      'I am about the age where I should start being suspicious of my own opinions on this.',
    ],
  },
  {
    id: 'the-micromort',
    date: 'June 8, 2026',
    title: 'A unit for one in a million',
    body: [
      'Ronald Howard proposed a unit for small risks, because we are hopeless at comparing them in words. One micromort is a one in a million chance of dying. It lets you put things next to each other.',
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
      'There are a few hundred billion stars in this galaxy and the galaxy has been here for a very long time. Even at speeds we can already imagine, something patient could have crossed it many times over. Enrico Fermi is supposed to have asked, over lunch, where everybody is.',
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
      'Robin Dunbar noticed that in primates, the size of the neocortex tracks the size of the group, and extrapolated to us. The number that came out was about 150: roughly how many people you can hold a real relationship with, meaning you know who they are and how they stand to each other.',
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
      'I like it as a story because the error is not a failure of intelligence. Everyone involved was clever. The data was accurate. The sample had simply been assembled by the thing being measured.',
      'I try to ask what would be missing from the evidence if the effect were real. I forget to, most of the time.',
    ],
  },
  {
    id: 'everyone-is-at-the-centre',
    date: 'April 12, 2026',
    title: 'Everyone is at the centre',
    body: [
      'The universe is about 13.8 billion years old, so it would be reasonable to expect that we can see 13.8 billion light years in any direction. The actual figure is closer to 46. Space expanded while the light was in transit, so the objects that emitted the oldest light we receive are now much further away than the light has travelled.',
      'That radius defines an observable universe, and it is centred on you. Not on Earth in any grand sense, just on whoever is doing the looking. Someone far away has their own sphere, overlapping ours, extending into regions we will never receive anything from.',
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
      'The awkward part is that the underlying effect is real anyway. Darley and Latané ran controlled experiments afterwards and found it repeatedly: the more people present, the less likely any one of them acts, because responsibility divides.',
      'So a real finding became famous through a story that was mostly wrong. Both halves are true and I have never found a tidy way to say them in the same breath.',
    ],
  },
]
