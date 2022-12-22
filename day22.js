const input_map = ``;

const input_instructions = ''; 

// Read input
const map = input_map.split('\n').map(row => row.split(''));

const dirs = ['L', 'R'];
const instructions = input_instructions.split('').reduce(
  (inst, c, i) => {
    if (dirs.includes(c)) {
      return inst.concat(c);
    }
    if (i === 0 || dirs.includes(inst[inst.length - 1])) {
      // Prev was a direction
      return inst.concat(c);
    }
    inst[inst.length - 1] += c;
    return inst;
  }, []);

// Instructions processor
const getNewPosition = (direction, position, distance) => {
  // Walk until real position or wall
  let distance_moved = 0;
  let i = 0;
  let new_position = position.slice();
  while (distance_moved < distance) {
    ++i;
    const [ x, y ] = position;
    const next_step = [
      [ x, y + i ],
      [ x + i, y ],
      [ x, y - i ],
      [ x - i, y ],
    ].map(([x,y]) => [
      (x+map.length)%map.length,
      (y+map[0].length)%map[0].length,
    ])[direction];
    if (map[next_step[0]][next_step[1]] === '#') {
      return [direction, new_position];
    }
    if (map[next_step[0]][next_step[1]] === '.') {
      ++distance_moved;
      new_position = next_step;
    }
  }
  return [direction, new_position];
};


const processInstructions = (direction, position, instruction_index, is_cube) => {
  if (instruction_index >= instructions.length) {
    // No more instructions
    return [...position, direction];
  }
  const instruction = instructions[instruction_index];
  if (dirs.includes(instruction)) {
    // Turn
    const new_direction = instruction === 'L' ?
      (direction + 3) % 4 :
      (direction + 1) % 4;
    return processInstructions(new_direction, position, instruction_index + 1, is_cube);
  }
  // Move
  const distance = Number(instruction);
  const [ new_direction, new_position ] = !is_cube ?
    getNewPosition(direction, position, distance) :
    getNewPositionCube(direction, position, distance);
  return processInstructions(new_direction, new_position, instruction_index + 1, is_cube);
};

const starting_row = map.findIndex(row => row.includes('.'));
const starting_col = map[starting_row].findIndex(c => c === '.');

const final_state = processInstructions(0, [starting_row,starting_col], 0, false);
const password_A = (final_state[0]+1) * 1000 + (final_state[1]+1)*4 + final_state[2];

// B
const changeRegion = (direction, position) => {
  const [ x, y, region ] = position;
  // Return format: direction, position
  if (region === 1) return [
    [0, [x, 0, 2]],
    [1, [0, y, 4]],
    [0, [49 - x, 0, 5]],
    [0, [y, 0, 3]],
  ][direction];
  if (region === 2) return [
    [2, [49 - x, 49, 6]],
    [2, [y, 49, 4]],
    [2, [x, 49, 1]],
    [3, [49, y, 3]],
  ][direction];
  if (region === 3) return [
    [3, [49, x, 6]],
    [1, [0, y, 2]],
    [1, [0, x, 1]],
    [3, [49, y, 5]],
  ][direction];
  if (region === 4) return [
    [3, [49, x, 2]],
    [1, [0, y, 6]],
    [1, [0, x, 5]],
    [3, [49, y, 1]],
  ][direction];
  if (region === 5) return [
    [0, [x, 0, 6]],
    [1, [0, y, 3]],
    [0, [49 - x, 0, 1]],
    [0, [y, 0, 4]],
  ][direction];
  if (region === 6) return [
    [2, [49 - x, 49, 2]],
    [2, [y, 49, 3]],
    [2, [x, 49, 5]],
    [3, [49, y, 4]],
  ][direction];
};

const getTrueCoords = ([ x, y, r ]) => {
  const region_top_left = [
    [0,50],  // 1
    [0,100], // 2
    [150,0], // 3
    [50,50], // 4
    [100,0], // 5
    [100,50], // 6
  ][r - 1];
  return [ x + region_top_left[0], y + region_top_left[1] ];
};

const hasARock = position => {
  const true_coords = getTrueCoords(position);
  return map[true_coords[0]][true_coords[1]] === '#';
};

const getNewPositionCube = (direction, position, distance) => {
  // Walk until distance or wall
  let new_position = position.slice();
  let new_direction = direction;

  for (let d = 0; d < distance; ++d) {
    // Will go over the region's borders
    const will_change_region = (
      (new_position[1] === 49 && new_direction === 0) ||
      (new_position[0] === 49 && new_direction === 1) ||
      (new_position[1] === 0  && new_direction === 2) ||
      (new_position[0] === 0  && new_direction === 3)
    );
    if (will_change_region) {
      // Change position & direction
      const changed_region_pos = changeRegion(new_direction, new_position);
      if (hasARock(changed_region_pos[1])) {
        return [new_direction, new_position];
      }
      new_direction = changed_region_pos[0];
      new_position = changed_region_pos[1];
    } else {
      // Just move inside region
      const [ x, y, r ] = new_position;
      const next_step = [
        [ x, y + 1, r ],
        [ x + 1, y, r ],
        [ x, y - 1, r ],
        [ x - 1, y, r ],
      ][new_direction];
      if (hasARock(next_step)) {
        return [new_direction, new_position];
      }
      new_position = next_step;
    }
  }
  return [new_direction, new_position];
};

const starting_pos_B = [0, 0, 1]; // x, y, region
const final_state_B = processInstructions(0, starting_pos_B, 0, true);
const coords_B = getTrueCoords(final_state_B);
const password_B = (coords_B[0]+1) * 1000 + (coords_B[1]+1)*4 + final_state_B[3];
