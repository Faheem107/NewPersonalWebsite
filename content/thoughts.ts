/**
 * Short pieces, newest first. Same arrangement as the research entries: the
 * page and the search index read this one file.
 *
 * House style: open on something concrete, a person or a date or a number,
 * and follow one thread. Name the effect or the study where there is one, and
 * where a well known story is shakier than its retelling, say so. Then turn it
 * round and ask what it means for the person reading, which is the point of
 * the piece. The reflection is first person and unsure of itself; it notices
 * things and does not hand down a moral. The range is wide on purpose: the
 * sky, minds, machines, risk, how things end. No em dashes.
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
    id: 'the-bright-part',
    date: 'October 10, 2026',
    title: 'We live in the bright part',
    body: [
      'The universe is 13.8 billion years old, which sounds like a long time until you look toward the other end. Stars will go on forming for something like a hundred trillion years. The smallest red dwarfs burn so slowly that some of the ones alive tonight will still be shining long after the Sun has gone out.',
      'After that comes a stretch so long that the numbers stop meaning anything to me. Cooling embers, then black holes, then the black holes themselves evaporating, and nothing new ever lit. Cosmologists call our own period the [[stelliferous-era|stelliferous era]], the age of stars, and on the full timeline it is a thin bright line at the very start.',
      'So we are early. If the whole age of stars were a single year, we would be a little over an hour into the first of January.',
      'I do not know what to do with that except notice it. The sky is crowded with light, there is a warm rock to stand on, and there are creatures on it who can work out roughly how long the light will last. On a clear night out in the desert, away from the city, that seems like a great deal to have been handed.',
    ],
  },
  {
    id: 'the-night-nothing-happened',
    date: 'September 26, 2026',
    title: 'The night nothing happened',
    body: [
      'Just after midnight on 26 September 1983, a Soviet early-warning satellite reported that the United States had launched a missile. Then it reported four more. The officer on duty in the bunker outside Moscow was Stanislav Petrov, and his job was to pass that report up the chain, where the people above him would have had minutes to decide whether to answer it.',
      'He reported a malfunction instead. He had reasons, though none of them was proof. The system was new and he did not trust it. Ground radar showed nothing. And a real first strike, he thought, would not be five missiles. "When people start a war," he said years later, "they don\'t start it with only five missiles."',
      'He was right. The satellite had taken sunlight on high clouds for rocket exhaust. He finished his shift and went home, and for years almost nobody knew.',
      'The system failed, which systems do. What unsettles me is how little stood behind it: between an ordinary Monday and the end of most things there was one tired man\'s sense that the numbers looked wrong.',
      'I also wonder how many nights like that there have been. We only ever look back from a history in which they went well, because [[anthropic-shadow|nobody is left to look back from the other kind]]. The record looks calm, and it would look calm to us either way.',
    ],
  },
  {
    id: 'the-horse-that-could-count',
    date: 'September 15, 2026',
    title: 'The horse that could count',
    body: [
      'In Berlin in 1904 a horse named Hans could add, subtract, tell the time and spell, tapping out his answers with a hoof. His owner, a retired teacher called Wilhelm von Osten, was not a fraud. A commission of experts watched closely and found no trick.',
      'Then a psychologist, Oskar Pfungst, tried something simple. He arranged things so that Hans could not see the person asking, or so that the person asking did not know the answer. With the questioner in view, Hans got 50 out of 56 right. Without, he got 2 out of 35.',
      'Hans had been reading people. As the taps came close to the right number the questioner tensed, and at the last one they relaxed by some tiny amount they knew nothing about, and he stopped. Nobody was cheating. The audience was supplying the answer and then being amazed by it.',
      'The story is usually told as a warning about animals, and lately about [[clever-hans|machines that seem to understand]]. I think it is mostly about the people leaning forward. When I ask a model a question I already know how I hope it will answer. I word things to suit, and I am pleased when it gets there. Pfungst\'s test is hard to run on yourself, because the whole trouble is that you cannot feel yourself giving the cue.',
      'I do have some sympathy for the horse. Noticing a millimetre of relief in a stranger\'s shoulders is not arithmetic, but it is not nothing either.',
    ],
  },
  {
    id: 'which-part-of-you-is-the-same',
    date: 'September 5, 2026',
    title: 'Which part of you is the same?',
    body: [
      'People say every cell in your body is replaced every seven years. It is a lovely idea, it is not quite true, and the way we found out is strange.',
      'Nuclear tests in the 1950s and 60s nearly doubled the carbon-14 in the air. After the tests were banned it fell away steadily, and all through that rise and fall it was being breathed, eaten and built into living things. A cell\'s DNA is written when the cell is born, so it keeps the level of that year like a date stamp. In 2005 Jonas Frisén\'s group in Stockholm used this [[bomb-pulse|bomb pulse]] to read the ages of cells in adults.',
      'The lining of the gut lasts days. Red blood cells last about four months. Muscle between the ribs averaged around fifteen years. But the neurons of the cortex were as old as the person they came from. Most of the body is a river, and the part that does the remembering is one of the few places where the first cells are still at work.',
      'Even there, the atoms inside each neuron are swapped out all the time, so what has lasted is an arrangement and not a material. I used to think of the ship of Theseus as a classroom puzzle. I now suspect I am one. Whatever I mean by "me" is closer to a tune than to the instrument it is being played on, and I do not know how much of the tune can change before it is a different one.',
    ],
  },
  {
    id: 'less-than-a-pixel',
    date: 'August 29, 2026',
    title: 'Less than a pixel',
    body: [
      'On 14 February 1990, Voyager 1 was six billion kilometres from home and on its way out of the solar system. Carl Sagan had spent years asking for one last thing before its cameras were switched off for good: turn around and photograph the Earth.',
      'There was no science in it. From that distance the planet would be smaller than a single pixel, and pointing the camera back toward the Sun put it at risk. The picture was taken anyway. In it the Earth is [[pale-blue-dot|a pale speck]] caught by chance in a band of scattered sunlight, and you would not find it unless somebody showed you where to look.',
      'Everything is in that speck. Every border I have crossed and every one I could not, every lecture hall, every argument I have lost sleep over, and the whole of history along with the people it left out.',
      'Sagan wrote that the picture underscores our responsibility to deal more kindly with one another. For me it does something smaller first. It makes my certainty feel out of scale. I can hold a strong opinion in a seminar room without much effort. It is harder to hold it in quite the same way while looking at the room from there.',
    ],
  },
  {
    id: 'counting-from-the-middle',
    date: 'August 15, 2026',
    title: 'Counting from the middle',
    body: [
      'In 1969 a young physicist named Richard Gott stood in front of the Berlin Wall, which was then eight years old, and tried to guess how long it had left. He had no special knowledge. He reasoned only that he was probably not visiting at a special moment, neither the very start of the wall\'s life nor the very end. From that alone he gave even odds that it would stand for somewhere between two and two-thirds and twenty-four more years. It came down twenty years later.',
      'The same reasoning can be turned on us. Something like 117 billion people have been born so far. If I am not special, I am probably not among the first few percent of all the humans who will ever live, and that puts a ceiling on how many are still to come. This is the [[doomsday-argument|doomsday argument]], and it concludes that we are more likely near the middle of the human story than on its opening page.',
      'Philosophers have argued over it for about forty years. Most think something is wrong with it and they do not agree on what. Perhaps it depends too much on who counts as "us". Perhaps your own birth is not the kind of thing you can treat as a random draw.',
      'What stays with me is how little it needs. There is no asteroid in it, no war and no machine, only the suggestion that I should not assume I am early. Every generation before mine seems to have felt it was living at the hinge of things. I notice that I feel it too.',
    ],
  },
  {
    id: 'two-triangles-and-a-circle',
    date: 'August 2, 2026',
    title: 'Two triangles and a circle',
    body: [
      'In 1944 Fritz Heider and Marianne Simmel showed a group of students a short silent film. In it a large triangle, a small triangle and a circle slide around a box with a door. That is the whole cast.',
      'Asked what they had seen, almost nobody answered with geometry. They described a bully and a couple, a chase, someone shut in a room, an escape. The big triangle was jealous. The circle was afraid. People who had never met agreed on this, about [[heider-simmel|three shapes cut out of card]].',
      'I think about that film whenever a language model tells me it is happy to help. If three shapes were enough to make people see fear, then something that answers in full sentences, remembers what I said and apologises was never going to leave me much choice. The sense that someone is there arrives before I have decided anything.',
      'None of this shows the sense is wrong. It shows that it is cheap, since it comes just as readily for a triangle. And it is the same sense I rely on for everyone I know. I have never seen another mind directly. I have only ever watched things move and listened to what they said, and filled in the rest myself.',
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
