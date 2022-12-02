const input = ``;

const instructions = input.split('\n').map(line => line.split(' '));

// A
const points_per_action = {
  'X': 1,
  'Y': 2,
  'Z': 3,
};
const points = instructions.reduce((points, [input, output]) => {
  const is_win = input === 'A' && output === 'Y' || input === 'B' && output === 'Z' || input === 'C' && output === 'X';
  const is_tie = input === 'A' && output === 'X' || input === 'B' && output === 'Y' || input === 'C' && output === 'Z';
  const result_points = is_win ? 6 : is_tie ? 3 : 0;
  const action_points = points_per_action[output];
  return points + result_points + action_points;
}, 0);

// B
const points_per_result = {
  'X': 0,
  'Y': 3,
  'Z': 6,
};
const points_B = instructions.reduce((points, [input, output]) => {
  const is_rock  = input === 'A' && output === 'Y' || input === 'B' && output === 'X' || input === 'C' && output === 'Z';
  const is_paper = input === 'A' && output === 'Z' || input === 'B' && output === 'Y' || input === 'C' && output === 'X';
  const result_points = points_per_result[output];
  const action_points = is_rock ? 1 : is_paper ? 2 : 3;
  return points + result_points + action_points;
}, 0);
