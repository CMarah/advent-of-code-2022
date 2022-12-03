const input = ``;

const rucksacks = input.split('\n');

const letterPriority = letter => {
  const char_code = letter.charCodeAt(0);
  if (char_code < 97) return char_code - 38; // Uppercase
  return char_code - 96;
};

// A
const total_priority_A = rucksacks
  .map(line => {
    const length = line.length;
    return [
      line.slice(0, length/2),
      line.slice(length/2),
    ];
  })
  .map(rucksack => {
    const common_letter = rucksack[0].split('')
      .find(letter => rucksack[1].includes(letter)); 
    return letterPriority(common_letter);
  })
  .reduce((sum, p) => sum + p, 0);

// B
const total_priority_B = rucksacks
  .map((rucksack, i) => {
    // Only do for first of each group
    if (i%3 !== 0) return 0;
    const badge_letter = rucksack.split('')
      .find(letter => rucksacks[i+1].includes(letter) && rucksacks[i+2].includes(letter)); 
    return letterPriority(badge_letter);
  })
  .reduce((sum, p) => sum + p, 0);
