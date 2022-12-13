const input = ``;

const matrix = input.split('\n').map(row => row.split(''));

const starting_coords_row = matrix.findIndex(row => row.some(e => e === 'S'));
const starting_coords_col = matrix[starting_coords_row].findIndex(e => e === 'S');
const end_coords_row      = matrix.findIndex(row => row.some(e => e === 'E'));
const end_coords_col      = matrix[end_coords_row].findIndex(e => e === 'E');

const isValidHeight = (height, current_height) => {
  if (!height) return false;
  if (current_height === 'S') return height === 'a';
  if (height === 'E') return ['z', 'y'].includes(current_height);
  return (height.charCodeAt(0) - current_height.charCodeAt(0)) <= 1;
};

const getNextNodes = node => {
  const current_height = matrix[node[0]][node[1]];
  const next_steps = [
    [node[0] - 1, node[1]],
    [node[0] + 1, node[1]],
    [node[0], node[1] - 1],
    [node[0], node[1] + 1],
  ];
  const heights = next_steps.map(step => matrix?.[step[0]]?.[step[1]]);
  return next_steps
    .filter((_, i) => isValidHeight(heights[i], current_height));
};

const emptyMatrix = () => matrix.map(row => row.map(() => undefined));

const findBestPathLength = (restart_on_a) => {
  // Initialize the matrix & queue
  let best_paths_to_node = emptyMatrix();
  best_paths_to_node[starting_coords_row][starting_coords_col] = [
    [starting_coords_row, starting_coords_col],
  ];
  let nodes = [[starting_coords_row, starting_coords_col]];

  // Process every node (could also sort by distance)
  while (nodes.length) {
    const current_node = nodes.shift();
    const current_path = best_paths_to_node[current_node[0]][current_node[1]];
    const next_nodes = getNextNodes(current_node);
    next_nodes.forEach(node => {
      const node_height = matrix[node[0]][node[1]];
      const new_path = node_height === 'a' && restart_on_a ?
        [node] : [...current_path, node];
      const old_path = best_paths_to_node?.[node[0]]?.[node[1]];
      if (!old_path || new_path.length < old_path.length) {
        best_paths_to_node[node[0]][node[1]] = new_path;
        nodes.push(node);
      }
    });
  }
  return best_paths_to_node[end_coords_row][end_coords_col].length - 1;
};

// A
const shortest_path_length = findBestPathLength(false);

// B
const shortest_path_length_restarting = findBestPathLength(true);
