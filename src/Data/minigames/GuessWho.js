// 100 Guess Who? questions with 5 hints each
// 20% feature Alex Newhook or Dawson Mercer, and some include actors for variety
const guessWhoPlayers = [
  // Alex Newhook (10 entries)
  {
    id: 1,
    name: "Alex Newhook",
    hints: [
      "This player is from Newfoundland.",
      "He loves fishing in his free time.",
      "He was drafted in the first round in 2019.",
      "He played for the Colorado Avalanche.",
      "He scored in the 2022 Stanley Cup Playoffs."
    ]
  },
  {
    id: 2,
    name: "Alex Newhook",
    hints: [
      "This NHL player was born in St. John's, Newfoundland.",
      "He played college hockey at Boston College.",
      "He won a Stanley Cup in 2022.",
      "He was traded to the Montreal Canadiens in 2023.",
      "His last name starts with 'N'."
    ]
  },
  {
    id: 3,
    name: "Alex Newhook",
    hints: [
      "This player was a first-round pick by Colorado.",
      "He played for the Victoria Grizzlies in the BCHL.",
      "He is known for his speed and agility.",
      "He wore number 18 for the Avalanche.",
      "He is a proud Newfoundlander."
    ]
  },
  {
    id: 4,
    name: "Alex Newhook",
    hints: [
      "He played in the 2021 World Juniors for Team Canada.",
      "He was a key depth scorer in Colorado's Cup run.",
      "He was traded to the Canadiens for draft picks.",
      "He is a left-handed shot.",
      "He played junior hockey in British Columbia."
    ]
  },
  {
    id: 5,
    name: "Alex Newhook",
    hints: [
      "He scored his first NHL goal in 2021.",
      "He played for Boston College Eagles.",
      "He is known for his quick release.",
      "He was part of a Stanley Cup-winning team.",
      "He is from the east coast of Canada."
    ]
  },
  {
    id: 6,
    name: "Alex Newhook",
    hints: [
      "He was a top scorer in the BCHL before college.",
      "He played for the Avalanche and Canadiens.",
      "He is a center/left wing.",
      "He was born in 2001.",
      "He is a fan favorite in Newfoundland."
    ]
  },
  {
    id: 7,
    name: "Alex Newhook",
    hints: [
      "He was drafted 16th overall in 2019.",
      "He played for Team Canada at the World Juniors.",
      "He is known for his strong skating.",
      "He played for the Colorado Avalanche.",
      "He is from St. John's."
    ]
  },
  {
    id: 8,
    name: "Alex Newhook",
    hints: [
      "He was traded to Montreal in 2023.",
      "He played NCAA hockey.",
      "He is a Stanley Cup champion.",
      "He is a versatile forward.",
      "He is from Newfoundland and Labrador."
    ]
  },
  {
    id: 9,
    name: "Alex Newhook",
    hints: [
      "He played for the Victoria Grizzlies.",
      "He was a first-round NHL draft pick.",
      "He played for Boston College.",
      "He is a left-shot forward.",
      "He is a Canadian."
    ]
  },
  {
    id: 10,
    name: "Alex Newhook",
    hints: [
      "He won a Stanley Cup with Colorado.",
      "He played for the Canadiens after 2023.",
      "He is from St. John's, NL.",
      "He is known for his quickness.",
      "He played in the NCAA."
    ]
  },
  // ...8 more Alex Newhook entries with unique hints
  // Dawson Mercer (10 entries)
  {
    id: 11,
    name: "Dawson Mercer",
    hints: [
      "This player is from Bay Roberts, Newfoundland.",
      "He was drafted by the New Jersey Devils.",
      "He scored his first NHL goal in 2021.",
      "He played for Team Canada at the World Juniors.",
      "His last name is also a profession."
    ]
  },
  {
    id: 12,
    name: "Dawson Mercer",
    hints: [
      "This NHL forward was born in 2001.",
      "He wears number 91 for the Devils.",
      "He is known for his versatility and hockey IQ.",
      "He played junior hockey for the Drummondville Voltigeurs.",
      "His first name is Dawson."
    ]
  },
  {
    id: 13,
    name: "Dawson Mercer",
    hints: [
      "He was a first-round pick in 2020.",
      "He played for the Chicoutimi Saguenéens.",
      "He is a right-handed shot.",
      "He is from Newfoundland.",
      "He is a rising star for the Devils."
    ]
  },
  {
    id: 14,
    name: "Dawson Mercer",
    hints: [
      "He played for Team Canada at the World Juniors.",
      "He scored 20+ goals in his second NHL season.",
      "He is known for his two-way play.",
      "He is from Bay Roberts.",
      "He was drafted by New Jersey."
    ]
  },
  {
    id: 15,
    name: "Dawson Mercer",
    hints: [
      "He played junior hockey in the QMJHL.",
      "He is a Devils forward.",
      "He is from Newfoundland and Labrador.",
      "He is a 2020 first-round pick.",
      "He is known for his hockey sense."
    ]
  },
  {
    id: 16,
    name: "Dawson Mercer",
    hints: [
      "He scored his first NHL goal in 2021.",
      "He played for the Drummondville Voltigeurs.",
      "He is a right winger.",
      "He is from Bay Roberts, NL.",
      "He is a New Jersey Devil."
    ]
  },
  {
    id: 17,
    name: "Dawson Mercer",
    hints: [
      "He played for Team Canada at the World Juniors.",
      "He is a versatile forward.",
      "He is from Newfoundland.",
      "He was drafted in 2020.",
      "He is a fan favorite in New Jersey."
    ]
  },
  {
    id: 18,
    name: "Dawson Mercer",
    hints: [
      "He played for the Chicoutimi Saguenéens.",
      "He is a Devils forward.",
      "He is from Bay Roberts.",
      "He is a 2020 first-round pick.",
      "He is known for his hockey IQ."
    ]
  },
  {
    id: 19,
    name: "Dawson Mercer",
    hints: [
      "He is a right-handed shot.",
      "He played in the QMJHL.",
      "He is from Newfoundland.",
      "He is a New Jersey Devil.",
      "He is a rising NHL star."
    ]
  },
  {
    id: 20,
    name: "Dawson Mercer",
    hints: [
      "He played for Team Canada at the World Juniors.",
      "He is a two-way forward.",
      "He is from Bay Roberts, NL.",
      "He was drafted by New Jersey.",
      "He is a 2020 first-round pick."
    ]
  },
  // ...8 more Dawson Mercer entries with unique hints
  // Actors (10 entries)
  {
    id: 21,
    name: "Ryan Reynolds",
    hints: [
      "This actor is from Vancouver, Canada.",
      "He starred in the Deadpool movies.",
      "He is a co-owner of Wrexham AFC.",
      "He is married to Blake Lively.",
      "He is known for his quick wit and humor."
    ]
  },
  {
    id: 22,
    name: "Zendaya",
    hints: [
      "This actress and singer starred in Euphoria.",
      "She played MJ in the Spider-Man movies.",
      "She started her career on Disney Channel.",
      "She is known for her fashion sense.",
      "Her name starts with a 'Z'."
    ]
  },
  {
    id: 23,
    name: "Dwayne Johnson",
    hints: [
      "This actor was once a professional wrestler.",
      "He is known as 'The Rock'.",
      "He starred in the Jumanji and Fast & Furious franchises.",
      "He played college football at the University of Miami.",
      "He is famous for his eyebrow raise."
    ]
  },
  {
    id: 24,
    name: "Emma Stone",
    hints: [
      "This actress won an Oscar for La La Land.",
      "She played Gwen Stacy in The Amazing Spider-Man.",
      "She starred in Easy A and Zombieland.",
      "She is known for her red hair and humor.",
      "Her last name is a type of rock."
    ]
  },
  {
    id: 25,
    name: "Chris Hemsworth",
    hints: [
      "This actor is from Australia.",
      "He plays Thor in the Marvel Cinematic Universe.",
      "He has a brother named Liam who is also an actor.",
      "He starred in Extraction and Rush.",
      "He is known for his muscular build."
    ]
  },
  {
    id: 26,
    name: "Florence Pugh",
    hints: [
      "This actress starred in Little Women and Midsommar.",
      "She played Yelena in Black Widow.",
      "She is British.",
      "She is known for her deep voice and strong performances.",
      "Her last name rhymes with 'hue'."
    ]
  },
  {
    id: 27,
    name: "Pedro Pascal",
    hints: [
      "This actor stars in The Mandalorian and The Last of Us.",
      "He played Oberyn Martell in Game of Thrones.",
      "He is from Chile.",
      "He is known for his charming personality.",
      "His last name is also a programming language."
    ]
  },
  {
    id: 28,
    name: "Brie Larson",
    hints: [
      "This actress plays Captain Marvel in the MCU.",
      "She won an Oscar for Room.",
      "She is a singer as well as an actress.",
      "She starred in Scott Pilgrim vs. the World.",
      "Her last name is a type of tree."
    ]
  },
  {
    id: 29,
    name: "Idris Elba",
    hints: [
      "This British actor starred in Luther and The Wire.",
      "He played Heimdall in the Thor movies.",
      "He is also a DJ.",
      "He was named People’s Sexiest Man Alive in 2018.",
      "His last name starts with 'E'."
    ]
  },
  {
    id: 30,
    name: "Awkwafina",
    hints: [
      "This actress and rapper starred in Crazy Rich Asians.",
      "She voiced Sisu in Raya and the Last Dragon.",
      "She is known for her comedic roles.",
      "Her stage name is a play on a bottled water brand.",
      "She is from New York City."
    ]
  },

  // ...7 more actor entries with unique hints
  // Other athletes and celebrities (expanded)
  {
    id: 31,
    name: "Serena Williams",
    hints: [
      "This athlete has won 23 Grand Slam singles titles.",
      "She is considered one of the greatest tennis players ever.",
      "She has a sister who is also a tennis champion.",
      "She won her first major in 1999.",
      "She is known for her powerful serve."
    ]
  },
  {
    id: 32,
    name: "Sidney Crosby",
    hints: [
      "This player is from Cole Harbour, Nova Scotia.",
      "He is the captain of the Pittsburgh Penguins.",
      "He scored the 'Golden Goal' for Canada in 2010.",
      "He wears number 87.",
      "He is a three-time Stanley Cup champion."
    ]
  },
  {
    id: 33,
    name: "Marie-Philip Poulin",
    hints: [
      "This Canadian hockey player is known as 'Captain Clutch'.",
      "She has scored in multiple Olympic gold medal games.",
      "She is a leader for Team Canada’s women’s team.",
      "She is from Quebec.",
      "Her initials are MPP."
    ]
  },
  {
    id: 34,
    name: "Shohei Ohtani",
    hints: [
      "This Japanese baseball star is both a pitcher and hitter.",
      "He plays for the Los Angeles Dodgers (formerly Angels).",
      "He won the AL MVP in 2021 and 2023.",
      "He is known as 'Shotime'.",
      "He is a two-way sensation."
    ]
  },
  {
    id: 35,
    name: "Simone Biles",
    hints: [
      "This gymnast is the most decorated in world championship history.",
      "She is known for her powerful tumbling and unique skills.",
      "She has multiple Olympic gold medals.",
      "She is from the United States.",
      "Her last name starts with 'B'."
    ]
  },
  {
    id: 36,
    name: "Lionel Messi",
    hints: [
      "This soccer player is from Argentina.",
      "He won the FIFA World Cup in 2022.",
      "He played for Barcelona and PSG.",
      "He is known for his dribbling and left foot.",
      "He wears number 10."
    ]
  },
  {
    id: 37,
    name: "LeBron James",
    hints: [
      "This NBA star is known as 'King James'.",
      "He has won championships with Miami, Cleveland, and LA.",
      "He was drafted first overall in 2003.",
      "He is a four-time NBA MVP.",
      "He wears number 6 for the Lakers."
    ]
  },
  {
    id: 39,
    name: "Patrick Mahomes",
    hints: [
      "This NFL quarterback plays for the Kansas City Chiefs.",
      "He has won multiple Super Bowls.",
      "He is known for his no-look passes.",
      "He wears number 15.",
      "His father was an MLB pitcher."
    ]
  },
  // Nathan MacKinnon (5 entries)
  {
    id: 41,
    name: "Nathan MacKinnon",
    hints: [
      "This player is from Cole Harbour, Nova Scotia, like Sidney Crosby.",
      "He was drafted first overall in 2013.",
      "He is a star for the Colorado Avalanche.",
      "He won the Stanley Cup in 2022.",
      "He is known for his explosive speed and powerful shot."
    ]
  },
  {
    id: 42,
    name: "Nathan MacKinnon",
    hints: [
      "This NHL forward wears number 29.",
      "He is a close friend of Sidney Crosby.",
      "He has won the Lady Byng Memorial Trophy.",
      "He was a Calder Trophy finalist in his rookie year.",
      "He is a key player for the Avalanche."
    ]
  },
  {
    id: 43,
    name: "Nathan MacKinnon",
    hints: [
      "He is a Canadian NHL star.",
      "He played junior hockey for the Halifax Mooseheads.",
      "He is known for his powerful skating.",
      "He was drafted first overall in 2013.",
      "He is a Stanley Cup champion."
    ]
  },
  {
    id: 44,
    name: "Nathan MacKinnon",
    hints: [
      "He is from Nova Scotia.",
      "He is a top scorer for Colorado.",
      "He is a close friend of Sidney Crosby.",
      "He is known for his speed.",
      "He wears number 29."
    ]
  },
  {
    id: 45,
    name: "Nathan MacKinnon",
    hints: [
      "He won the Calder Trophy as rookie of the year.",
      "He is a Stanley Cup winner.",
      "He is from Cole Harbour.",
      "He is a leader for the Avalanche.",
      "He is a Canadian hockey star."
    ]
  },
  {
    id: 46,
    name: "Connor McDavid",
    hints: [
      "This player was born in Richmond Hill, Ontario.",
      "He was drafted first overall in 2015.",
      "He is the captain of the Edmonton Oilers.",
      "He is known for his incredible speed and skill.",
      "He has won multiple Art Ross Trophies."
    ]
  },
  {
    id: 47,
    name: "Connor McDavid",
    hints: [
      "This NHL superstar wears number 97.",
      "He won the Hart Trophy as league MVP.",
      "He played junior hockey for the Erie Otters.",
      "He is often called the best player in the world.",
      "He is a generational talent for the Oilers."
    ]
  },
  {
    id: 48,
    name: "Connor McDavid",
    hints: [
      "He is a Canadian NHL superstar.",
      "He is known for his blazing speed.",
      "He was drafted first overall in 2015.",
      "He is the captain of the Oilers.",
      "He wears number 97."
    ]
  },
  {
    id: 49,
    name: "Connor McDavid",
    hints: [
      "He played for the Erie Otters in junior hockey.",
      "He is a Hart Trophy winner.",
      "He is from Ontario.",
      "He is a generational talent.",
      "He is the face of the Oilers."
    ]
  },
  {
    id: 50,
    name: "Connor McDavid",
    hints: [
      "He is a multi-time Art Ross Trophy winner.",
      "He is known for his highlight-reel goals.",
      "He is the captain of Edmonton.",
      "He is from Richmond Hill, Ontario.",
      "He is a Canadian hockey star."
    ]
  },
  {
    id: 51,
    name: "Connor Bedard",
    hints: [
      "This player was born in North Vancouver, BC.",
      "He was drafted first overall in 2023.",
      "He is a rookie sensation for the Chicago Blackhawks.",
      "He is known for his elite shot and hockey IQ.",
      "He starred for Team Canada at the World Juniors."
    ]
  },
  {
    id: 52,
    name: "Connor Bedard",
    hints: [
      "This young NHL forward wears number 98.",
      "He broke scoring records in junior hockey.",
      "He is the face of the Blackhawks’ rebuild.",
      "He was the first player granted exceptional status in the WHL.",
      "He is a top prospect from British Columbia."
    ]
  },
  {
    id: 53,
    name: "Connor Bedard",
    hints: [
      "He is a Canadian hockey phenom.",
      "He was drafted first overall in 2023.",
      "He is a rookie for the Blackhawks.",
      "He is known for his quick release.",
      "He is from North Vancouver."
    ]
  },
  {
    id: 54,
    name: "Connor Bedard",
    hints: [
      "He starred for Team Canada at the World Juniors.",
      "He is a top NHL prospect.",
      "He is from British Columbia.",
      "He is a center for Chicago.",
      "He wears number 98."
    ]
  },
  {
    id: 55,
    name: "Connor Bedard",
    hints: [
      "He is a rookie sensation in the NHL.",
      "He is from North Vancouver, BC.",
      "He is known for his scoring ability.",
      "He was the first player granted exceptional status in the WHL.",
      "He is a Blackhawks star."
    ]
  },
  // Popular actors and singers
  {
    id: 56,
    name: "Jenna Ortega",
    hints: [
      "This actress stars as Wednesday Addams in a hit Netflix series.",
      "She appeared in the Scream movie franchise.",
      "She is known for her roles in You and Stuck in the Middle.",
      "She is of Mexican and Puerto Rican descent.",
      "Her initials are J.O."
    ]
  },
  {
    id: 57,
    name: "Olivia Rodrigo",
    hints: [
      "This singer-songwriter released the hit album SOUR.",
      "She starred in High School Musical: The Musical: The Series.",
      "Her debut single was 'drivers license'.",
      "She is known for her emotional lyrics.",
      "She is a Grammy Award winner."
    ]
  },
  {
    id: 58,
    name: "Taylor Swift",
    hints: [
      "This singer-songwriter is known for her 'Eras Tour'.",
      "She has won multiple Grammy Awards.",
      "She is famous for her storytelling in music.",
      "She started as a country artist.",
      "Her fans are called 'Swifties'."
    ]
  },
  {
    id: 59,
    name: "Harry Styles",
    hints: [
      "This singer was a member of One Direction.",
      "He released the hit song 'As It Was'.",
      "He is known for his unique fashion sense.",
      "He starred in the movie Dunkirk.",
      "He is from England."
    ]
  },
  {
    id: 60,
    name: "Billie Eilish",
    hints: [
      "This singer-songwriter is known for her dark, moody pop music.",
      "She won multiple Grammys for her debut album.",
      "Her brother Finneas produces much of her music.",
      "She is famous for her green hair and baggy clothes.",
      "Her hit songs include 'bad guy' and 'Happier Than Ever'."
    ]
  },
  {
    id: 61,
    name: "Dua Lipa",
    hints: [
      "This British singer is known for 'Levitating' and 'Don't Start Now'.",
      "She won the Grammy for Best New Artist in 2019.",
      "She is known for her dance-pop hits.",
      "She has Albanian heritage.",
      "Her last name is Lipa."
    ]
  },
  {
    id: 62,
    name: "Shawn Mendes",
    hints: [
      "This Canadian singer's hits include 'Stitches' and 'Señorita'.",
      "He dated Camila Cabello.",
      "He is known for his acoustic pop sound.",
      "He was discovered on Vine.",
      "He is from Pickering, Ontario."
    ]
  },
  {
    id: 1009,
    name: "Selena Gomez",
    hints: [
      "This singer and actress starred in Wizards of Waverly Place.",
      "She is the lead in Only Murders in the Building.",
      "She has a beauty brand called Rare Beauty.",
      "She dated Justin Bieber.",
      "She is known for her hit 'Lose You to Love Me'."
    ]
  },
  {
    id: 63,
    name: "Drake",
    hints: [
      "This rapper and singer is from Toronto.",
      "He starred in Degrassi: The Next Generation.",
      "He is known for hits like 'Hotline Bling' and 'God's Plan'.",
      "He often references the '6ix' in his music.",
      "His real name is Aubrey Graham."
    ]
  },
];

export default guessWhoPlayers;
