const input = ``;

// Process input
const cubes = input.split('\n').map(l => l.split(',').map(c => parseInt(c)));

const grouped_by_coord = cubes.reduce((groups, cube) => {
  const [x, y, z] = cube;
  if (!groups.x[x]) groups.x[x] = [];
  groups.x[x].push([y, z]);
  if (!groups.y[y]) groups.y[y] = [];
  groups.y[y].push([x, z]);
  if (!groups.z[z]) groups.z[z] = [];
  groups.z[z].push([x, y]);
  return groups;
}, { x: [], y: [], z: [] });

// A
const countSides = groups => groups.reduce(
  (acc, group, index) => {
    const prev_group = groups[index-1];
    if (!prev_group) return acc + group.length*2;
    const count = group.filter(
      r => !prev_group.some(p => p[0] === r[0] && p[1] === r[1])
    ).length;
    return acc + count*2;
  }, 0);

const area = countSides(grouped_by_coord.x)
  + countSides(grouped_by_coord.y)
  + countSides(grouped_by_coord.z);

// B
const LIMITS = [
  grouped_by_coord.x.length,
  grouped_by_coord.y.length,
  grouped_by_coord.z.length,
];

// For caching purposes
let nodes_exposed = [];
let nodes_trapped = [];
let blocked_nodes = cubes.map(n => n.toString());

const addToList = (visited, list) => visited.forEach(n => {
  if (!list.includes(n)) { list.push(n); }
});

const canExit = (start) => {
  // There is a path from node to edges
  let pending_nodes = [start];
  let visited_nodes = [];
  while (pending_nodes.length) {

    const node = pending_nodes.pop();
    const node_id = node.toString();
    visited_nodes.push(node_id);

    // Check if in one of the lists
    if (nodes_exposed.includes(node_id)) {
      addToList(visited_nodes, nodes_exposed);
      return true;
    }
    if (nodes_trapped.includes(node_id)) {
      addToList(visited_nodes, nodes_trapped);
      return false;
    }

    // Check if is on an edge
    const is_free = node.some((coord, i) => coord <= 0 || coord === LIMITS[i]);
    if (is_free) {
      addToList(visited_nodes, nodes_exposed);
      return true;
    }

    // Add neighbors to list
    const neighbor_nodes = [[0,0,1], [0,1,0], [1,0,0], [0,0,-1], [0,-1,0], [-1,0,0]]
      .map(move => move.map((c, i) => c + node[i]))
      .filter(n => {
        const n_id = n.toString();
        return !visited_nodes.includes(n_id) && !blocked_nodes.includes(n_id);
      });
    pending_nodes.push(...neighbor_nodes);
  }
  // No path
  addToList(visited_nodes, nodes_trapped);
  return false;
};

const countSidesWithoutPockets = cubes => cubes.reduce(
  (acc, cube) => {
    // For each of the cubes sides, find if there's a path to the exit
    const sides = [[0,0,1], [0,1,0], [1,0,0], [0,0,-1], [0,-1,0], [-1,0,0]]
      .map(move => move.map((c, i) => c + cube[i]))
      .filter(n => !blocked_nodes.includes(n.toString()));
    return acc + sides.filter(canExit).length;
  }, 0);

const area_without_pockets = countSidesWithoutPockets(cubes);
