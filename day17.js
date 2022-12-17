const jetstreams = ``;

const shapes = [
  { // Line
    height: 1,
    points: [[0,0], [1,0], [2,0], [3,0]],
  },
  { // Cross
    height: 3,
    points: [[0,1], [1,0], [1,1], [1,2], [2,1]],
  },
  { // L
    height: 3,
    points: [[0,0], [1,0], [2,0], [2,1], [2,2]],
  },
  { // Vertical line
    height: 4,
    points: [[0,0], [0,1], [0,2], [0,3]],
  },
  { // Square
    height: 2,
    points: [[0,0], [1,0], [0,1], [1,1]],
  },
];

const applyJetsream = (shape_pos, shape, jetstream, room) => {
  const move = jetstream === '>' ? 1 : -1;
  const is_valid_move = shape.points.every(([x, y]) => {
    const new_x = shape_pos.x + x + move;
    const true_y = shape_pos.y + y;
    if (new_x < 0 || new_x >= 7) return false;
    if (!room[true_y]) return true;
    return !room[true_y][new_x];
  });
  return is_valid_move ?
    { x: shape_pos.x + move, y: shape_pos.y } :
    shape_pos;
};

const canDesced = (shape_pos, shape, room) =>
  shape.points.every(([x, y]) => {
    const true_x = shape_pos.x + x;
    const new_y = shape_pos.y + y - 1;
    if (new_y > 0 && !room[new_y]) return true;
    return new_y >= 0 && !room[new_y][true_x];
  });

const placeShape = (shape_pos, shape, room) => {
  shape.points.forEach(([x, y]) => {
    const true_x = shape_pos.x + x;
    const true_y = shape_pos.y + y;
    if (!room[true_y]) {
      room[true_y] = new Array(7).fill(0);
    }
    room[true_y][true_x] = 1;
  });
  return room;
};

const processNextShape = (shape_number, jetstream_index, current_height, room) => {
  // shape_pos points to bottom left corner of shape
  const shape = shapes[shape_number%shapes.length];
  let shape_pos = { x: 2, y: current_height + 4 };

  while (true) { // Main loop

    // Process jetstream
    const jetstream = jetstreams[jetstream_index%jetstreams.length];
    ++jetstream_index;
    shape_pos = applyJetsream(shape_pos, shape, jetstream, room);

    // Move down
    const can_move_down = canDesced(shape_pos, shape, room);
    if (can_move_down) {
      shape_pos = {
        x: shape_pos.x,
        y: shape_pos.y - 1,
      };
    } else {
      // We are done
      return {
        jetstream_index,
        current_height: Math.max(shape_pos.y + shape.height - 1, current_height),
        room: placeShape(shape_pos, shape, room),
      };
    }
  }
};

const getPattern = (shape_number, room) => {
  const col_heights = (new Array(7)).fill().map((_, i) => {
    let first_row_height = room.length - 1;
    while (!room[first_row_height][i]) {
      --first_row_height;
    }
    return first_row_height;
  });
  const min_height = Math.min(...col_heights);
  const shape_index = shape_number%shapes.length;
  const pattern = shape_index + '-' + col_heights.map(h => h - min_height).join('-');
  return pattern;
};

const getStructureHeight = rocks => {
  // Basic data
  let jetstream_index = 0;
  let room = [
    new Array(7).fill(1),
  ];
  let current_height = 0;

  // Perf aux variables
  let patterns = {};
  let skipped = 0;
  let extra_height = 0;

  // Iterate every rock
  for (let shape_number = 0; (shape_number + skipped) < rocks; ++shape_number) {
    // Look for repeating patterns in the room
    if (!skipped && jetstream_index%jetstreams.length === 0) {
      const pattern = getPattern(shape_number, room);
      if (patterns[pattern]) {
        const prev_pattern = patterns[pattern];
        const loop_length = shape_number - prev_pattern[0];
        const height_gain = current_height - prev_pattern[1];
        const num_loops = parseInt((rocks - shape_number)/loop_length) - 0;
        skipped = num_loops*loop_length;
        extra_height = num_loops*height_gain;
      } else {
        patterns[pattern] = [shape_number, current_height];
      }
    }
    const results = processNextShape(shape_number, jetstream_index, current_height, room);
    jetstream_index = results.jetstream_index;
    room = results.room;
    current_height = results.current_height;
  };

  return current_height + extra_height;
};

// A
const height_after_2022 = getStructureHeight(2022);

// B
const height_after_1000000000000 = getStructureHeight(1000000000000);
