/**
 * animals.js
 * Central data store for all Australian wildlife reward animals.
 * To add a new animal:
 *  1. Find lat/lng on Google Maps (2 decimal places is sufficient)
 *  2. Add the去背 PNG to /public/images/animals/
 *  3. Append a new object to the ANIMALS array
 */

export const ANIMALS = [
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
    // },
  ]