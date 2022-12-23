const input = ``;

const input_rows = input.split('\n').length;
const input_cols = input.split('\n')[0].length;

const input_map = input.split('\n').map(row => row.split(''));
const initialMap = () => [
  ...(new Array(1000)).fill(0).map(() => (new Array(input_cols + 1000)).fill('.')),
  ...input_map.map(row => [
    ...(new Array(500)).fill('.'),
    ...row,
    ...(new Array(500)).fill('.'),
  ]),
  ...(new Array(1000)).fill(0).map(() => (new Array(input_cols + 1000)).fill('.')),
];

const initialElfs = () => initialMap().reduce((acc, row, x) => {
  row.forEach((el, y) => {
    if (el === '#') {
      acc.push({ x, y, move_order: ['N', 'S', 'W', 'E'] });
    }
  });
  return acc;
}, []);

const movesToCoords = {
  'N': [-1, 0],
  'S': [1, 0],
  'E': [0, 1],
  'W': [0, -1],
};

const isAlone = (x, y, map) =>
  map[x-1][y-1] === '.' &&
  map[x-1][y] === '.' &&
  map[x-1][y+1] === '.' &&
  map[x][y-1] === '.' &&
  map[x][y+1] === '.' &&
  map[x+1][y-1] === '.' &&
  map[x+1][y] === '.' &&
  map[x+1][y+1] === '.';

const checkMove = (x, y, map, move) => {
  if (move === 'N' || move === 'S') {
    return map[x][y] === '.' &&
      map[x][y + 1] === '.' &&
      map[x][y - 1] === '.';
  }
  return map[x][y] === '.' &&
    map[x-1][y] === '.' &&
    map[x+1][y] === '.';
};

const processElfs = (map, elfs) => {
  const movements = elfs.map(({ x, y, move_order }) => {
    if (isAlone(x, y, map)) return [x, y, null];
    for (const move of move_order) {
      const [ new_x, new_y ] = movesToCoords[move].map((coord, i) => coord + (i === 0 ? x : y));
      if (checkMove(new_x, new_y, map, move)) return [new_x, new_y, move];
    }
    return [x, y, null];
  });

  // Clear map
  elfs.forEach(({ x, y }) => {
    map[x][y] = '.';
  });


  // Update elfs
  const new_elfs = elfs.map(({ x, y, move_order }, i) => {
    const [ new_x, new_y, move ] = movements[i];
    const new_move_order = move_order.slice(1).concat(move_order[0]);
    if (!move) {
      return { x, y, move_order: new_move_order };
    }
    const cant_move = elfs.some((_, j) => {
      if (i === j) return false;
      const [ other_elf_x, other_elf_y ] = movements[j];
      return other_elf_x === new_x && other_elf_y === new_y;
    });
    if (cant_move) {
      return { x, y, move_order: new_move_order };
    } else {
      return { x: new_x, y: new_y, move_order: new_move_order };
    }
  });

  // Update map
  new_elfs.forEach(({ x, y }) => {
    map[x][y] = '#';
  });

  return [ map, new_elfs ];
};

// A
const runNumRounds = (map, elfs, num_rounds) => {
  let current_map = map;
  let current_elfs = elfs;

  for (let round = 0; round < num_rounds; round++) {
    [ current_map, current_elfs ] = processElfs(current_map, current_elfs);
  }

  return current_elfs;
};

const final_elfs = runNumRounds(initialMap(), initialElfs(), 10);
const min_x = Math.min(...final_elfs.map(({ x }) => x));
const max_x = Math.max(...final_elfs.map(({ x }) => x));
const min_y = Math.min(...final_elfs.map(({ y }) => y));
const max_y = Math.max(...final_elfs.map(({ y }) => y));
const num_empty_squares = (max_x - min_x + 1) * (max_y - min_y + 1) - final_elfs.length;

// B
const finalRound = (map, elfs) => {
  let round = 0;
  let current_map = map;
  let current_elfs = elfs;

  while (!current_elfs.every(({ x, y }) => isAlone(x, y, current_map))) {
    ++round;
    [ current_map, current_elfs ] = processElfs(current_map, current_elfs);
  }

  return round + 1;
};
