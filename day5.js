const input_start = ``;
const input_moves = ``;

// Ìnput processing
const raw_base_state = input_start.split('\n');

const num_stacks = parseInt(raw_base_state.at(-1).split(' ').at(-1));

const raw_stacks = (new Array(num_stacks).fill(0))
  .map((_, i) => {
    // Each crate of stack i corresponds to position 4*i in each line
    return raw_base_state.map(line => line.slice(4*i, 4*(i+1)).trim());
  });

const base_stacks = raw_stacks.map(
  stack => stack.map(c => c.includes('[') ? c[1] : '').join('')
);

const processed_moves = input_moves.split('\n').map(move => {
  const [ raw_num, raw_start, raw_end ] = move.match(/\d+/g);
  // Decrease 1 to map to indexes
  return [parseInt(raw_num), raw_start - 1, raw_end - 1];
});

// A
const reverse = str => str.split('').reverse().join('');

const final_stacks_A = processed_moves.reduce(
  (stacks, move) => {
    const [ num, start, end ] = move;
    stacks[end] = reverse(stacks[start].slice(0, num)) + stacks[end];
    stacks[start] = stacks[start].slice(num);
    return stacks;
  }, [...base_stacks]);

const solution_A = final_stacks_A.reduce((code, stack) => code + stack.at(0), '');

// B
const final_stacks_B = processed_moves.reduce(
  (stacks, move) => {
    const [ num, start, end ] = move;
    stacks[end] = stacks[start].slice(0, num) + stacks[end];
    stacks[start] = stacks[start].slice(num);
    return stacks;
  }, [...base_stacks]);

const solution_B = final_stacks_B.reduce((code, stack) => code + stack.at(0), ''); 
