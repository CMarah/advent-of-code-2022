const input = ``;

const moves = input.split('\n')
  .map(move => ([move[0], parseInt(move.slice(2))]));

// Aux functions

const distance = ([x1, y1], [x2, y2]) =>
  Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));

const getNewVisited = (tail_pos, visited) => {
  const is_unvisited = visited.every(visited =>
    visited[0] !== tail_pos[0] ||
    visited[1] !== tail_pos[1]
  );
  return !is_unvisited ?
    visited :
    [ ...visited, tail_pos];
};

const getNewKnotPos = (prev_knot_pos, knot_pos) => {
  const current_distance = distance(prev_knot_pos, knot_pos);
  if (current_distance <= 1) return knot_pos;
  if (prev_knot_pos[0] === knot_pos[0]) {
    // Above
    if (prev_knot_pos[1] > knot_pos[1]) {
      return [knot_pos[0], knot_pos[1] + 1];
    }
    // Below
    return [knot_pos[0], knot_pos[1] - 1];
  }
  if (prev_knot_pos[1] === knot_pos[1]) {
    // Right
    if (prev_knot_pos[0] > knot_pos[0]) {
      return [knot_pos[0] + 1, knot_pos[1]];
    }
    // Left
    return [knot_pos[0] - 1, knot_pos[1]];
  }
  if (prev_knot_pos[0] > knot_pos[0]) {
    // Right, above
    if (prev_knot_pos[1] > knot_pos[1]) {
      return [knot_pos[0] + 1, knot_pos[1] + 1];
    } 
    // Right, below
    return [knot_pos[0] + 1, knot_pos[1] - 1];
  }
  if (prev_knot_pos[0] < knot_pos[0]) {
    // Left, above
    if (prev_knot_pos[1] > knot_pos[1]) {
      return [knot_pos[0] - 1, knot_pos[1] + 1];
    } 
    // Left, below
    return [knot_pos[0] - 1, knot_pos[1] - 1];
  }
};

const processMove = ({ rope, visited }, move) => {
  // Find out new head position
  const [head_x, head_y] = rope[0];
  const [dir, dist] = move;
  const new_head_pos = [
    dir === 'R' ? (head_x + 1) : dir === 'L' ? (head_x - 1) : head_x,
    dir === 'U' ? (head_y + 1) : dir === 'D' ? (head_y - 1) : head_y,
  ];

  // Find out new rope positions
  let new_rope_positions = [new_head_pos];
  for (let i = 1; i < rope.length; i++) {
    new_rope_positions.push(
      getNewKnotPos(new_rope_positions[i - 1], rope[i])
    );
  };

  // Build next state
  const new_tail_pos = new_rope_positions[rope.length - 1];
  const new_visited = getNewVisited(new_tail_pos, visited);
  const new_state = {
    rope: new_rope_positions,
    visited: new_visited,
  };
  if (dist === 1) return new_state;
  return processMove(new_state, [dir, dist - 1]);
};

// A
const num_knots_A = 2;
const final_state_A = moves.reduce(
  processMove,
  {
    rope: Array(num_knots_A).fill([0, 0]),
    visited: [],
  },
);
const ans_A = final_state_A.visited.length;

// B
const num_knots_B = 10;
const final_state_B = moves.reduce(
  processMove,
  {
    rope: Array(num_knots_B).fill([0, 0]),
    visited: [],
  },
);
const ans_B = final_state_B.visited.length;
