const input = ``;

const parseBlueprint = line => {
  const matches = line.match(/Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./);
  const values = matches.slice(1).map(Number);
  return [
    [values[0], 0, 0, 0],
    [values[1], 0, 0, 0],
    [values[2], values[3], 0, 0],
    [values[4], 0, values[5], 0],
  ];
};

const blueprints = input.split('\n').map(parseBlueprint);

// Processors
const newResources = (resources, robots) => resources.map((r, i) => r + robots[i]);

const numGeodes = (blueprint, initial_time) => {
  // Cache used to avoid recalculating the same values
  let b_cache = {};

  const buildOptions = (time, robots, resources, forbidden_robots) => robots
    .map((_, i) => {
      if (i === 0 && time <= initial_time - 8) {
        // After a certain point, we no longer want any ore robots
        return 0;
      }
      if (forbidden_robots.includes(i)) return 0;
      const canBuild = blueprint[i].every((c, j) => c <= resources[j]);
      if (!canBuild) return 0;
      let newRobots = robots.slice();
      ++newRobots[i];
      const removed_resources = resources.map((r, j) => r - blueprint[i][j]);
      return getBest(time-1, newRobots, newResources(removed_resources, robots), []);
    })
    .filter(x => x);

  const doNothingOpt = (time, robots, resources) => {
    // If a robot isn't built now, then don't build until something else is built
    const possible_robots = robots.map((_, i) => {
      const canBuild = blueprint[i].every((c, j) => c <= resources[j]);
      return canBuild ? i : null;
    }).filter(i => i !== null);
    return getBest(time-1, robots, newResources(resources, robots), possible_robots);
  };

  const getBest = (time, robots, resources, forbidden_robots) => {
    // Base cases
    if (time === 0) return resources[3];
    const key = `${time}-${robots}-${resources}`;
    if (b_cache[key]) return b_cache[key];

    // Progress
    const do_nothing_opt = doNothingOpt(time, robots, resources);
    const build_options = buildOptions(time, robots, resources, forbidden_robots);
    const best = Math.max(do_nothing_opt, ...build_options);

    b_cache[key] = best;
    return best;
  };

  return getBest(initial_time, [1, 0, 0, 0], [0, 0, 0, 0], []);
};

// A
const total_quality = blueprints.reduce(
  (q, blueprint, i) => q + (i+1)*numGeodes(blueprint, 24)
, 0);

// B
const num_geodes_product =
  numGeodes(blueprints[0], 32) *
  numGeodes(blueprints[1], 32) *
  numGeodes(blueprints[2], 32);
