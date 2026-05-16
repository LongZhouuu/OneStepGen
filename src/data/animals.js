/**
 * animals.js
 * Central data store for all Australian wildlife reward animals.
 * To add a new animal:
 *  1. Find lat/lng on Google Maps (2 decimal places is sufficient)
 *  2. Add the cutout PNG (for map pin) to /public/images/animals/
 *  3. Add 3 real photos (.jpg) to /public/images/animals/, named <id>-1.jpg ... <id>-3.jpg
 *  4. Append a new object to the ANIMALS array including photos / photoCredits / descriptionSource
 */

export const ANIMALS = [
    // Wombat
    {
      id: 'wombat',
      name: 'Common Wombat',
      region: 'Tasmania & Southern Australia',
      lat: -42.55,
      lng: 148.04,
      image: '/images/animals/Vombatus.png',
      hint: 'This round, muscular creature digs tunnels up to 30 metres long and leaves behind something no other animal in the world produces. What is it?',
      description: 'The common wombat is a short-legged, muscular marsupial native to Australia. Mostly nocturnal, they emerge at night to graze on grasses, roots and bark. Their backwards-facing pouch is a clever adaptation — it prevents soil from getting in while they dig.',
      funFact: 'Wombats are the only animals in the world that produce cube-shaped droppings — and they use them to mark territory!',
      photos: [
        '/images/animals/wombat-1.jpg',
        '/images/animals/wombat-2.jpg',
        '/images/animals/wombat-3.jpg',
      ],
      photoCredits: [
        'Dalal / Unsplash',
        'Nick Da Fonseca / Unsplash',
        'Dey Alexander / Flickr · CC BY-NC-SA 2.0',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Wombat. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Wombat',
      },
    },

    // Quokka
    {
      id: 'quokka',
      name: 'Quokka',
      region: 'Western Australia',
      lat: -32.00,
      lng: 115.54,
      image: '/images/animals/quokka.png',
      hint: 'This small smiling marsupial became famous online because it always appears happy in selfies. What animal is it?',
      description: 'The quokka is a small marsupial native to Western Australia, especially Rottnest Island. They are nocturnal herbivores and are known for their friendly appearance and curious nature.',
      funFact: 'Quokkas are often called “the happiest animals in the world” because of their smile-like facial expression.',
      photos: [
        '/images/animals/quokka-1.jpg',
        '/images/animals/quokka-2.jpg',
        '/images/animals/quokka-3.jpg',
      ],
      photoCredits: [
        'Christine Mendoza / Unsplash',
        'Albert F. Vontz / Unsplash',
        'Natalie Su / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Quokka. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Quokka',
      },
    },

    // Tasmanian Devil
    {
      id: 'tasmanian-devil',
      name: 'Tasmanian Devil',
      region: 'Tasmania',
      lat: -41.50,
      lng: 145.50,
      image: '/images/animals/devil.png',
      hint: 'This animal is famous for its loud screeches, strong bite, and fiery personality despite its small size. What is it?',
      description: 'The Tasmanian devil is a carnivorous marsupial found only in Tasmania. It has a stocky body, black fur, and one of the strongest bites relative to body size among mammals.',
      funFact: 'Tasmanian devils can eat almost every part of their prey, including bones and fur.',
      photos: [
        '/images/animals/devil-1.jpg',
        '/images/animals/devil-2.jpg',
        '/images/animals/devil-3.jpg',
      ],
      photoCredits: [
        'David Clode / Unsplash',
        'Gino Marcelo Hernandez Sanchez / Unsplash',
        'Kunal Kalra / Unsplash',
        'Lottie Corin / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Tasmanian devil. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Tasmanian_devil',
      },
    },

    // Numbat
    {
      id: 'numbat',
      name: 'Numbat',
      region: 'Western Australia',
      lat: -32.85,
      lng: 118.00,
      image: '/images/animals/numbat.png',
      hint: 'This small striped marsupial spends most of its day searching for termites with its long sticky tongue. What animal is it?',
      description: 'The numbat is a small marsupial native to Western Australia. It has distinctive white stripes across its back and feeds almost entirely on termites during the daytime.',
      funFact: 'Numbats can eat up to 20,000 termites in a single day.',
      photos: [
        '/images/animals/numbat-1.jpg',
        '/images/animals/numbat-2.jpg',
        '/images/animals/numbat-3.jpg',
      ],
      photoCredits: [
        'Martin Pelanek/Shutterstock',
        'Ken Griffiths/Shutterstock',
        'Rainie Zhang/Getty Images',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Numbat. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Numbat',
      },
    },
    
    // Saltwater Crocodile
    {
      id: 'saltwater-crocodile',
      name: 'Saltwater Crocodile',
      region: 'Northern Territory',
      lat: -13.00,
      lng: 131.00,
      image: '/images/animals/crocodile.png',
      hint: 'This massive reptile is the largest living crocodile species in the world and can survive in both rivers and the ocean. What animal is it?',
      description: 'The saltwater crocodile is a large reptile found in northern Australia. It is an apex predator known for its powerful jaws, strong swimming ability, and adaptability to both freshwater and saltwater habitats.',
      funFact: 'Saltwater crocodiles can grow over 6 metres long and swim long distances across the ocean.',
      photos: [
        '/images/animals/crocodile-1.jpg',
        '/images/animals/crocodile-2.jpg',
        '/images/animals/crocodile-3.jpg',
      ],
      photoCredits: [
        'David Clode / Unsplash',
        'Andrew Tom / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Saltwater crocodile. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Saltwater_crocodile',
      },
    },

    // thorny-devil
    {
      id: 'thorny-devil',
      name: 'Thorny Devil',
      region: 'Northern Territory',
      lat: -23.50,
      lng: 133.50,
      image: '/images/animals/thorny-devil.png',
      hint: 'This tiny desert lizard is covered in sharp spikes and can collect water through grooves in its skin. What animal is it?',
      description: 'The thorny devil is a small lizard native to Australia’s arid deserts. Its body is covered in cone-shaped spines that help protect it from predators and camouflage it among dry vegetation.',
      funFact: 'Thorny devils can transport water through tiny channels in their skin directly to their mouths.',
      photos: [
        '/images/animals/thorny-devil-1.jpg',
        '/images/animals/thorny-devil-2.jpg',
        '/images/animals/thorny-devil-3.jpg',
      ],
      photoCredits: [
        'Peter Walton Photography/Getty Images',
        'Gillian Carter',
        'wildelife tree edzoocation',
        'wildherps',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Thorny devil. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Thorny_devil',
      },
    },

    // Dingo
    {
      id: 'dingo',
      name: 'Dingo',
      region: 'Northern Territory',
      lat: -18.50,
      lng: 130.50,
      image: '/images/animals/dingo.png',
      hint: 'This wild Australian canine is known for its sharp ears, sandy coat, and haunting nighttime howl. What animal is it?',
      description: 'The dingo is a wild dog native to Australia. Dingoes are highly adaptable predators found across deserts, forests, and grasslands, often living alone or in small packs.',
      funFact: 'Unlike many domestic dogs, dingoes rarely bark and usually communicate through howls.',
      photos: [
        '/images/animals/dingo-1.jpg',
        '/images/animals/dingo-2.jpg',
        '/images/animals/dingo-3.jpg',
      ],
      photoCredits: [
        'Craig Manners / Unsplash',
        'Alex Gisby / Unsplash',
        'Tarryn Grignet / Unsplash',
        'Joshua Bayliss / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Dingo. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Dingo',
      },
    },

    // Cassowary
    {
      id: 'cassowary',
      name: 'Cassowary',
      region: 'Queensland',
      lat: -15.92,
      lng: 144.77,
      image: '/images/animals/cassowary.png',
      hint: 'This large flightless bird has bright blue skin, a helmet-like crest, and is often called one of the world’s most dangerous birds. What animal is it?',
      description: 'The cassowary is a large flightless bird native to the tropical rainforests of northern Queensland. It plays an important role in spreading rainforest seeds and maintaining forest biodiversity.',
      funFact: 'Cassowaries can jump high, run up to 50 km/h, and deliver powerful kicks with sharp claws.',
      photos: [
        '/images/animals/cassowary-1.jpg',
        '/images/animals/cassowary-2.jpg',
        '/images/animals/cassowary-3.jpg',
      ],
      photoCredits: [
        'Gilles Rolland-Monnet / Unsplash',
        'Summerdrought on Wikimedia Commons',
        'Jesper van der Pol / Unsplash',
        'David Clode / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Cassowary. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Cassowary',
      },
    },

    // Platypus
    {
      id: 'platypus',
      name: 'Platypus',
      region: 'Queensland',
      lat: -19.50,
      lng: 147.50,
      image: '/images/animals/platypus.png',
      hint: 'This unusual animal has a duck-like bill, webbed feet, and lays eggs even though it is a mammal. What animal is it?',
      description: 'The platypus is a semi-aquatic mammal native to eastern Australia. It is one of the few living monotremes, meaning it lays eggs instead of giving birth to live young.',
      funFact: 'Male platypuses have venomous spurs on their hind legs.',
      photos: [
        '/images/animals/platypus-1.jpg',
        '/images/animals/platypus-2.jpg',
        '/images/animals/platypus-3.jpg',
      ],
      photoCredits: [
        'Mick Tsikas/Reuters,Reuters Picture Stream/MED',
        'Nicole Duplaix, National Geographic',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Platypus. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Platypus',
      },
    },

    // Sea Turtle
    {
      id: 'sea-turtle',
      name: 'Sea Turtle',
      region: 'Queensland',
      lat: -18.00,
      lng: 145.80,
      image: '/images/animals/sea-turtle.png',
      hint: 'This ancient marine reptile travels thousands of kilometres across the ocean and returns to the same beach to lay eggs. What animal is it?',
      description: 'Sea turtles are marine reptiles found in the warm coastal waters of Queensland, especially around the Great Barrier Reef. They spend most of their lives in the ocean and migrate long distances between feeding and nesting areas.',
      funFact: 'Some sea turtles can travel more than 10,000 kilometres during migration.',
      photos: [
        '/images/animals/sea-turtle-1.jpg',
        '/images/animals/sea-turtle-2.jpg',
        '/images/animals/sea-turtle-3.jpg',
      ],
      photoCredits: [
        'Olga ga / Unsplash',
        'jcob nasyr / Unsplash',
        'Jesse Schoff / Unsplash',
        'Randall Ruiz / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Sea turtle. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Sea_turtle',
      },
    },

    // Koala
    {
      id: 'koala',
      name: 'Koala',
      region: 'New South Wales',
      lat: -33.50,
      lng: 150.50,
      image: '/images/animals/koala.png',
      hint: 'This sleepy tree-dwelling marsupial spends most of its day resting and feeds almost entirely on eucalyptus leaves. What animal is it?',
      description: 'The koala is a marsupial native to eastern Australia. They live in eucalyptus forests and are known for their fluffy ears, large nose, and calm behaviour.',
      funFact: 'Koalas can sleep up to 20 hours a day to conserve energy from their low-nutrient diet.',
      photos: [
        '/images/animals/koala-1.jpg',
        '/images/animals/koala-2.jpg',
        '/images/animals/koala-3.jpg',
      ],
      photoCredits: [
        'Bob Walker / Unsplash',
        'Roland Kay-Smith / Unsplash',
        'Jordan Whitt / Unsplash',
        'Gary Runn / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Koala. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Koala',
      },
    },

    // Kookaburra
    {
      id: 'kookaburra',
      name: 'Kookaburra',
      region: 'New South Wales',
      lat: -32.00,
      lng: 149.00,
      image: '/images/animals/kookaburra.png',
      hint: 'This Australian bird is famous for its loud call that sounds like human laughter. What animal is it?',
      description: 'The kookaburra is a large kingfisher native to eastern Australia. It is commonly found in forests, parks, and suburban areas, where its distinctive laughing call is often heard at dawn and dusk.',
      funFact: 'Kookaburras use their strong beaks to catch insects, snakes, and even small reptiles.',
      photos: [
        '/images/animals/kookaburra-1.jpg',
        '/images/animals/kookaburra-2.jpg',
        '/images/animals/kookaburra-3.jpg',
      ],
      photoCredits: [
        'Peter Scholten / Unsplash',
        'William Warby / Unsplash',
        'Stephen Tafra / Unsplash',
        'Jump4joy4 (Reddit)',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Kookaburra. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Kookaburra',
      },
    },

    // Sugar Glider
    {
      id: 'sugar-glider',
      name: 'Sugar Glider',
      region: 'New South Wales',
      lat: -30.50,
      lng: 152.00,
      image: '/images/animals/sugar-glider.png',
      hint: 'This tiny nocturnal marsupial can glide between trees using a stretchy membrane attached to its body. What animal is it?',
      description: 'The sugar glider is a small tree-dwelling marsupial native to eastern Australia. They are nocturnal animals that live in forests and glide through the air to travel between trees.',
      funFact: 'Sugar gliders can glide more than 50 metres without touching the ground.',
      photos: [
        '/images/animals/sugar-glider-1.jpg',
        '/images/animals/sugar-glider-2.jpg',
        '/images/animals/sugar-glider-3.jpg',
      ],
      photoCredits: [
        'David Clode / Unsplash',
        'Timur Garifov / Unsplash',
        'Henry Lai / Unsplash',
        'Auscape International Pty Ltd/Alamy Stock Photo',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Sugar glider. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Sugar_glider',
      },
    },

    // Quoll
    {
      id: 'quoll',
      name: 'Quoll',
      region: 'New South Wales & Queensland',
      lat: -28.50,
      lng: 152.50,
      image: '/images/animals/quoll.png',
      hint: 'This spotted carnivorous marsupial is an agile night hunter that climbs trees and searches for small prey. What animal is it?',
      description: 'Quolls are carnivorous marsupials native to Australia. They have soft fur covered with white spots and are active mainly at night, hunting insects, birds, and small mammals.',
      funFact: 'Quolls store fat in their tails, similar to how camels store fat in their humps.',
      photos: [
        '/images/animals/quoll-1.jpg',
        '/images/animals/quoll-2.jpg',
        '/images/animals/quoll-3.jpg',
      ],
      photoCredits: [
        'AussieArk',
        'Lucia Griggi / rainforest Rescue',
        'Charles J. Sharp / Wikimedia Commons',
        'Guy NŒHRINGER / Wikimedia Commons',

      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Quoll. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Quoll',
      },
    },

    // Fairy Penguin
    {
      id: 'fairy-penguin',
      name: 'Fairy Penguin',
      region: 'Victoria',
      lat: -38.50,
      lng: 144.70,
      image: '/images/animals/fairy-penguin.png',
      hint: 'This tiny blue penguin comes ashore in groups after sunset and is the smallest penguin species in the world. What animal is it?',
      description: 'The fairy penguin, also known as the little penguin, is native to the southern coastlines of Australia. They spend most of their lives in the ocean and return to land at night to rest and care for their chicks.',
      funFact: 'Fairy penguins can swim up to 15 kilometres per hour while hunting small fish.',
      photos: [
        '/images/animals/fairy-penguin-1.jpg',
        '/images/animals/fairy-penguin-2.jpg',
        '/images/animals/fairy-penguin-3.jpg',
      ],
      photoCredits: [
        'Kunal Kalra / Unsplash',
        'Marvin Langer / Unsplash',
        'JJ Harrison / Wikimedia Commons',
        'Phillip Island Tours',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Little penguin. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Little_penguin',
      },
    },

    // Echidna
    {
      id: 'echidna',
      name: 'Echidna',
      region: 'Victoria',
      lat: -37.50,
      lng: 147.00,
      image: '/images/animals/echidna.png',
      hint: 'This spiky egg-laying mammal uses its long sticky tongue to catch ants and termites. What animal is it?',
      description: 'The echidna is a small monotreme native to Australia. Covered in sharp spines and fur, it feeds mainly on ants and termites and can dig quickly to protect itself from predators.',
      funFact: 'Echidnas are one of the very few mammals in the world that lay eggs.',
      photos: [
        '/images/animals/echidna-1.jpg',
        '/images/animals/echidna-2.jpg',
        '/images/animals/echidna-3.jpg',
      ],
      photoCredits: [
        'Enguerrand Photography / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Echidna. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Echidna',
      },
    },

    // Wedge-tailed Eagle
    {
      id: 'wedge-tailed-eagle',
      name: 'Wedge-tailed Eagle',
      region: 'South Australia',
      lat: -32.00,
      lng: 138.50,
      image: '/images/animals/wedge-tailed-eagle.png',
      hint: 'This massive bird of prey has powerful wings, excellent eyesight, and is Australia’s largest eagle. What animal is it?',
      description: 'The wedge-tailed eagle is the largest bird of prey in Australia. It is known for its long broad wings, wedge-shaped tail, and ability to soar high above open landscapes while searching for prey.',
      funFact: 'Wedge-tailed eagles can have a wingspan of over 2.5 metres.',
      photos: [
        '/images/animals/wedge-tailed-eagle-1.jpg',
        '/images/animals/wedge-tailed-eagle-2.jpg',
        '/images/animals/wedge-tailed-eagle-3.jpg',
      ],
      photoCredits: [
        'Hunter Masters / Unsplash',
        'Elisa Stone / Unsplash',
        'Julius Mburu / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Wedge-tailed eagle. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Wedge-tailed_eagle',
      },
    },

    // Leafy Sea Dragon
    {
      id: 'leafy-sea-dragon',
      name: 'Leafy Sea Dragon',
      region: 'South Australia',
      lat: -35.50,
      lng: 138.00,
      image: '/images/animals/leafy-sea-dragon.png',
      hint: 'This underwater creature looks like floating seaweed and is closely related to seahorses. What animal is it?',
      description: 'The leafy sea dragon is a marine fish native to southern Australia, especially along the coast of South Australia. Its leaf-like appendages provide excellent camouflage among seaweed and kelp.',
      funFact: 'Male leafy sea dragons carry and protect the eggs until they hatch.',
      photos: [
        '/images/animals/leafy-sea-dragon-1.jpg',
        '/images/animals/leafy-sea-dragon-2.jpg',
        '/images/animals/leafy-sea-dragon-3.jpg',
      ],
      photoCredits: [
        'Markus Kammermann / Unsplash',
        'Tomás Evaristo/ Unsplash',
        'Joel Sartore National Geographic Photo Ark',

      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Leafy seadragon. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Leafy_seadragon',
      },
    },

    // Emu
    {
      id: 'emu',
      name: 'Emu',
      region: 'South Australia',
      lat: -31.50,
      lng: 135.60,
      image: '/images/animals/emu.png',
      hint: 'This tall flightless bird can run at high speeds across the Australian outback. What animal is it?',
      description: 'The emu is a large flightless bird native to Australia and the second-largest bird in the world by height. Emus are commonly found in open grasslands, woodlands, and semi-arid regions.',
      funFact: 'Emus can run up to 50 kilometres per hour using their long powerful legs.',
      photos: [
        '/images/animals/emu-1.jpg',
        '/images/animals/emu-2.jpg',
        '/images/animals/emu-3.jpg',
      ],
      photoCredits: [
        'David Clode / Unsplash',
        'Daniel Olaleye / Unsplash',
        'Melissa Keizer / Unsplash',
        'Reba Spike / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Emu. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Emu',
      },
    },

    // Cockatoo
    {
      id: 'cockatoo',
      name: 'Cockatoo',
      region: 'New South Wales',
      lat: -32.50,
      lng: 146.00,
      image: '/images/animals/cockatoo.png',
      hint: 'This intelligent white bird is famous for its loud calls and expressive feather crest. What animal is it?',
      description: 'Cockatoos are highly social parrots native to Australia. They are known for their curved beaks, striking crests, and ability to mimic sounds and human speech.',
      funFact: 'Cockatoos can use tools and solve puzzles, showing advanced problem-solving abilities.',
      photos: [
        '/images/animals/cockatoo-1.jpg',
        '/images/animals/cockatoo-2.jpg',
        '/images/animals/cockatoo-3.jpg',
      ],
      photoCredits: [
        'Magda Vrabetz / Unsplash',
        'Green Liu / Unsplash',
        'Kelli McClintock / Unsplash',
        'Laya Clode / Unsplash',
      ],
      descriptionSource: {
        citation: 'Wikipedia contributors. (2024). Cockatoo. Wikipedia.',
        url: 'https://en.wikipedia.org/wiki/Cockatoo',
      },
    },

    // Add more animals here following the same shape:
    // {
    //   id: 'quokka',
    //   name: 'Quokka',
    //   region: 'Western Australia',
    //   lat: -32.00,
    //   lng: 115.54,
    //   image: '/images/animals/quokka.png',
    //   hint: '...',
    //   description: '...',
    //   funFact: '...',
    //   photos: [
    //     '/images/animals/quokka-1.jpg',
    //     '/images/animals/quokka-2.jpg',
    //     '/images/animals/quokka-3.jpg',
    //   ],
    //   photoCredits: [
    //     'Photographer / Source',
    //     'Photographer / Source',
    //     'Photographer / Source',
    //   ],
    //   descriptionSource: {
    //     citation: 'Author. (Year). Title. Site.',
    //     url: 'https://example.com',
    //   },
    // },
  ]