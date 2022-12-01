const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

const data = input.split('\n');
// Reduce through every line, each result's position is the elf's total calories
const elf_calories = data.reduce(
  (elf_calories, line) => {
    if (line === '') {
      // Go to next elf
      return elf_calories.concat(0);
    } else {
      // Add calories to current elf
      const calories = parseInt(line);
      elf_calories[elf_calories.length - 1] += calories;
      return elf_calories;
    }
  }, [0]
);

// A
const max_elf_calories = Math.max(...elf_calories);

// B
const top3_elf_calories = elf_calories.reduce(
  (top3_elf_calories, calories) => {
    if (calories > top3_elf_calories[2]) {
      top3_elf_calories[2] = calories;
      top3_elf_calories.sort((a, b) => b - a);
    }
    return top3_elf_calories;
  }, [0, 0, 0]
);
const top3_sum = top3_elf_calories.reduce((a, b) => a + b);
