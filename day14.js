const input = ``;

// Preprocessing & initialization
const walls = input.split('\n');
const points = input.split(' -> ').map(c => c.split('\n')).flat();

const side_bounds  = points.map(p => parseInt(p.split(',')[0]));
const lower_bounds = points.map(p => parseInt(p.split(',')[1]));
const RIGHT_BOUND  = Math.max(...side_bounds);
const LEFT_BOUND   = Math.min(...side_bounds);
const LOWER_BOUND  = Math.max(...lower_bounds);
const SAND_SPAWN_X = 500;

const baseMap = (extra_lower_floor) => {
  const input_map = Array(RIGHT_BOUND*2).fill().map(() => []);
  if (!extra_lower_floor) {
    // Just use input
    return input_map;
  }
  // Use input plus floor at LOWER_BOUND + 2
  for (let i = 0; i < input_map.length; i++) {
    input_map[i][LOWER_BOUND + 2] = 1;
  }
  return input_map;
};

const initialState = (extra_lower_floor) => walls.reduce(
  (map, wall) => {
    const segments = wall.split(' -> ');
    segments.forEach((segment, i) => {
      if (i === segments.length - 1) return;
      const [x_1, y_1] = segment.split(',');
      const [x_2, y_2] = segments[i + 1].split(',');
      const x_start = Math.min(x_1, x_2);
      const x_end = Math.max(x_1, x_2);
      const y_start = Math.min(y_1, y_2);
      const y_end = Math.max(y_1, y_2);
      if (x_start === x_end) {
        for (let y = y_start; y <= y_end; ++y) {
          map[x_start][y] = 1;
        }
      } else {
        for (let x = x_start; x <= x_end; ++x) {
          map[x][y_start] = 1;
        }
      }
    });
    return map;
  }
, baseMap(extra_lower_floor));

// Processors
const nextSandPos = ([sand_x, sand_y], state) => {
  // Try down, then down left, then down right
  const empty_below = !state[sand_x]?.[sand_y + 1];
  if (empty_below) return [sand_x, sand_y + 1];
  const empty_dleft = !state[sand_x-1]?.[sand_y + 1];
  if (empty_dleft) return [sand_x-1, sand_y + 1];
  const empty_dright = !state[sand_x+1]?.[sand_y + 1];
  if (empty_dright) return [sand_x+1, sand_y + 1];
  return null;
};

const dropSand = ([sand_x, sand_y], state, check_blocked_spawn) => {
  // Calculate next sand position & place it, if possible
  const next_sand_pos = nextSandPos([sand_x, sand_y], state);
  if (!next_sand_pos) {
    // Sand can't move, place it
    state[sand_x][sand_y] = 1;
    return { next_state: state };
  }
  // If in problem A, check if we're out of bounds
  if (!check_blocked_spawn && (
    next_sand_pos[0] < LEFT_BOUND ||
    next_sand_pos[0] > RIGHT_BOUND ||
    next_sand_pos[1] > LOWER_BOUND
  )) {
    return { done: true };
  }
  return dropSand(next_sand_pos, state, check_blocked_spawn);
};

const countSand = (check_blocked_spawn) => {
  // Keep adding sand until requirement is met
  let sand_count = 0;
  let state = initialState(check_blocked_spawn);
  while (true) {
    const initial_sand_pos = [SAND_SPAWN_X, 0];
    const { done, next_state } = dropSand(initial_sand_pos, state, check_blocked_spawn);
    if (done) {
      return sand_count;
    }
    state = next_state;
    if (check_blocked_spawn && state[SAND_SPAWN_X][0] === 1) {
      return sand_count + 1;
    }
    sand_count += 1;
  }
};

// A
const sand_count_A = countSand(false);

// B
const sand_count_B = countSand(true);
