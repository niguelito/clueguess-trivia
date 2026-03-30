/**
 * @fileOverview Static data for default trivia decks available to all users.
 */

export interface DefaultTriviaCard {
  id: string;
  mainClue: string;
  subClues: string[];
  answer: string;
}

export interface DefaultDeck {
  id: string;
  name: string;
  description: string;
  cards: DefaultTriviaCard[];
}

export const DEFAULT_DECKS: DefaultDeck[] = [
  {
    id: "default-science",
    name: "General Science",
    description: "Explore the wonders of biology, physics, and chemistry.",
    cards: [
      { id: "s1", mainClue: "The fundamental building block of all matter.", subClues: ["It contains a nucleus.", "Composed of protons and neutrons.", "The word comes from Greek for 'indivisible'."], answer: "Atom" },
      { id: "s2", mainClue: "The process plants use to convert sunlight into energy.", subClues: ["Occurs in chloroplasts.", "Requires carbon dioxide and water.", "Produces oxygen as a byproduct."], answer: "Photosynthesis" },
      { id: "s3", mainClue: "The force that keeps planets in orbit.", subClues: ["It pulls objects toward the center of the Earth.", "Calculated using mass and distance.", "Isaac Newton is famous for his laws regarding this."], answer: "Gravity" },
      { id: "s4", mainClue: "The molecule that carries genetic instructions.", subClues: ["It has a double helix structure.", "Made of nucleotides.", "Found in the nucleus of cells."], answer: "DNA" },
      { id: "s5", mainClue: "The most abundant gas in Earth's atmosphere.", subClues: ["It makes up about 78% of the air.", "Its atomic number is 7.", "Used in fertilizers."], answer: "Nitrogen" },
      { id: "s6", mainClue: "The closest star to Earth.", subClues: ["It's a yellow dwarf star.", "A giant ball of hot plasma.", "It is roughly 93 million miles away."], answer: "The Sun" },
      { id: "s7", mainClue: "The boiling point of water in Celsius.", subClues: ["It is 212 degrees Fahrenheit.", "Point where liquid turns to gas.", "Standard at sea level."], answer: "100" },
      { id: "s8", mainClue: "The unit used to measure electrical resistance.", subClues: ["Represented by the Greek letter Omega.", "Named after a German physicist.", "Part of a law involving Voltage and Current."], answer: "Ohm" },
      { id: "s9", mainClue: "The hardest natural substance on Earth.", subClues: ["Made entirely of carbon.", "Formed deep under ground in high pressure.", "Used in jewelry and industrial drills."], answer: "Diamond" },
      { id: "s10", mainClue: "An astronomical object with gravity so strong that nothing, not even light, can escape.", subClues: ["Formed by the collapse of massive stars.", "Has an 'event horizon'.", "There is a supermassive one at the center of our galaxy."], answer: "Black Hole" },
      { id: "s11", mainClue: "The part of the cell often called the 'powerhouse'.", subClues: ["Produces ATP.", "Has its own DNA.", "Double-membraned organelle."], answer: "Mitochondria" },
      { id: "s12", mainClue: "The chemical symbol for Gold.", subClues: ["Atomic number 79.", "Comes from the Latin word 'Aurum'.", "A transition metal."], answer: "Au" },
      { id: "s13", mainClue: "The three states of matter.", subClues: ["Solid, Liquid, and...", "One is highly compressible.", "Water can be all three."], answer: "Solid Liquid Gas" },
      { id: "s14", mainClue: "The scientist who developed the theory of General Relativity.", subClues: ["Famous for E=mc².", "Won a Nobel Prize for the photoelectric effect.", "Had iconic wild hair."], answer: "Albert Einstein" },
      { id: "s15", mainClue: "The largest planet in our solar system.", subClues: ["It is a gas giant.", "Has a Great Red Spot.", "Has 79 known moons."], answer: "Jupiter" },
      { id: "s16", mainClue: "The study of heredity.", subClues: ["Gregor Mendel is the father of this field.", "Involves dominant and recessive traits.", "Uses Punnett squares."], answer: "Genetics" },
      { id: "s17", mainClue: "The light-sensitive layer at the back of the eye.", subClues: ["Contains rods and cones.", "Transmits signals to the optic nerve.", "Inverts images before processing."], answer: "Retina" },
      { id: "s18", mainClue: "Speed of light in a vacuum.", subClues: ["Approximately 300,000 km per second.", "The 'c' in Einstein's equation.", "Fastest speed in the universe."], answer: "299,792,458 m/s" },
      { id: "s19", mainClue: "Smallest bone in the human body.", subClues: ["Found in the middle ear.", "Shaped like a stirrup.", "Also called the stapes."], answer: "Stapes" },
      { id: "s20", mainClue: "The first person to walk on the moon.", subClues: ["Commanded Apollo 11.", "Said 'One small step for man'.", "Landed in the Sea of Tranquility."], answer: "Neil Armstrong" }
    ]
  },
  {
    id: "default-history",
    name: "World History",
    description: "Journey through time from ancient civilizations to the modern era.",
    cards: [
      { id: "h1", mainClue: "The ancient civilization that built the Great Pyramids of Giza.", subClues: ["Located along the Nile River.", "Ruled by Pharaohs.", "Developed Hieroglyphics."], answer: "Ancient Egypt" },
      { id: "h2", mainClue: "The year the Berlin Wall fell, signaling the end of the Cold War.", subClues: ["It was in the late 1980s.", "Happened in November.", "Two years before the USSR dissolved."], answer: "1989" },
      { id: "h3", mainClue: "The French queen famous for the phrase 'Let them eat cake'.", subClues: ["Married to Louis XVI.", "Executed during the French Revolution.", "Of Austrian descent."], answer: "Marie Antoinette" },
      { id: "h4", mainClue: "The ship that sank in 1912 after hitting an iceberg.", subClues: ["Considered 'unsinkable' at the time.", "On its maiden voyage to New York.", "Over 1,500 people perished."], answer: "Titanic" },
      { id: "h5", mainClue: "The first President of the United States.", subClues: ["General during the Revolutionary War.", "Featured on the one-dollar bill.", "Refused to be king."], answer: "George Washington" },
      { id: "h6", mainClue: "The conflict that lasted from 1939 to 1945.", subClues: ["Involved Axis and Allied powers.", "Began with the invasion of Poland.", "Ended after atomic bombs were dropped on Japan."], answer: "World War II" },
      { id: "h7", mainClue: "The Mongolian leader who created the largest land empire in history.", subClues: ["Born with the name Temujin.", "Unified the Mongol tribes.", "Grandfather of Kublai Khan."], answer: "Genghis Khan" },
      { id: "h8", mainClue: "The period of 'rebirth' in Europe after the Middle Ages.", subClues: ["Began in Italy.", "Home to Leonardo da Vinci.", "Focus on humanism and classical art."], answer: "The Renaissance" },
      { id: "h9", mainClue: "The ancient Greek city-state known for its military culture.", subClues: ["Rivals of Athens.", "Battle of Thermopylae.", "Young boys trained in the Agoge."], answer: "Sparta" },
      { id: "h10", mainClue: "The documented end of the Western Roman Empire.", subClues: ["Odoacer deposed the last emperor.", "It happened in 476 AD.", "Marked the beginning of the Middle Ages."], answer: "476 AD" },
      { id: "h11", mainClue: "The 1215 document that limited the power of the English King.", subClues: ["Signed by King John.", "Latin for 'Great Charter'.", "Foundational for modern law."], answer: "Magna Carta" },
      { id: "h12", mainClue: "The plague that killed nearly half of Europe's population in the 14th century.", subClues: ["Carried by fleas on rats.", "Also known as the Bubonic Plague.", "Spread via trade routes."], answer: "The Black Death" },
      { id: "h13", mainClue: "The first female pilot to fly solo across the Atlantic Ocean.", subClues: ["Disappeared over the Pacific in 1937.", "Author and pioneer.", "Flying a Lockheed Electra."], answer: "Amelia Earhart" },
      { id: "h14", mainClue: "The inventor of the printing press in the 15th century.", subClues: ["German goldsmith.", "First book printed was the Bible.", "Revolutionized the spread of information."], answer: "Johannes Gutenberg" },
      { id: "h15", mainClue: "The civilization that inhabited Machu Picchu.", subClues: ["Located in the Andes Mountains.", "Expert stonemasons without mortar.", "Used Quipu for record-keeping."], answer: "The Inca" },
      { id: "h16", mainClue: "The Japanese warriors who followed the code of Bushido.", subClues: ["Served daimyo lords.", "Used katanas.", "Abolished during the Meiji Restoration."], answer: "Samurai" },
      { id: "h17", mainClue: "The 19th-century conflict between Northern and Southern US states.", subClues: ["Fought over slavery and states' rights.", "Abraham Lincoln was President.", "Battle of Gettysburg."], answer: "The American Civil War" },
      { id: "h18", mainClue: "The leader of the Civil Rights Movement who gave the 'I Have a Dream' speech.", subClues: ["Baptist minister.", "Won the Nobel Peace Prize in 1964.", "Assassinated in Memphis, 1968."], answer: "Martin Luther King Jr." },
      { id: "h19", mainClue: "The industrial revolution began in this country.", subClues: ["Driven by coal and steam power.", "Known as Great Britain.", "Changed from agrarian to industrial."], answer: "England" },
      { id: "h20", mainClue: "The ancient wall built to protect against invasions from the north.", subClues: ["Over 13,000 miles long.", "Built primarily of stone and brick.", "Started during the Qin Dynasty."], answer: "Great Wall of China" }
    ]
  }
];
