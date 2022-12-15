const input_a = ``;

// Data
const info = input_a.split('\n').map(line => {
  const raw_sensor_pos = line.match(/x=(-?\d+), y=(-?\d+):/g)[0];
  const raw_beacon_pos = line.match(/x=(-?\d+), y=(-?\d+)$/g)[0];
  const sensor_pos = raw_sensor_pos.split(',').map(x => parseInt(x.match(/-?\d+/g)[0]));
  const beacon_pos = raw_beacon_pos.split(',').map(x => parseInt(x.match(/-?\d+/g)[0]));
  return [sensor_pos, beacon_pos];
});
const COORD_LIMIT = 4000000;

// Manhattan distance
const getDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// Single sensor coverage at height h
const getIndividualCoverage = (h, sensor, beacon) => {
  const covered_width = getDistance(sensor, beacon) - Math.abs(sensor[1] - h);
  if (covered_width <= 0) return null;
  return [sensor[0] - covered_width, sensor[0] + covered_width];
};

const mergeIntervals = (intervals, limited) => {
  // If limited, don't include points outside valid range
  if (!limited) {
    const lower_bound = Math.min(...intervals.map(x => x[0]));
    const higher_bound = Math.max(...intervals.map(x => x[1]));
    return [lower_bound, higher_bound];
  } else {
    const lower_bound = Math.max(0, Math.min(...intervals.map(x => x[0])));
    const higher_bound = Math.min(COORD_LIMIT, Math.max(...intervals.map(x => x[1])));
    return [lower_bound, higher_bound];
  }
};

const areConnected = (i1, i2) => {
  const is_contained = i1[0] <= i2[0] && i1[1] >= i2[1];
  const is_left_connected = i1[0] <= i2[0] && i1[1] >= i2[0];
  const is_right_connected = i2[0] <= i1[0] && i2[1] >= i1[0];
  return is_contained || is_left_connected || is_right_connected;
};

// Find covered intervals at given height
const getCoverage = (h, info, limited) => {
  const intervals = info.map(x => getIndividualCoverage(h, x[0], x[1]))
    .filter(x => x);
  const merged_intervals = intervals.reduce(
    (merged_intervals, interval) => {
      const connected_intervals = merged_intervals.filter(x => areConnected(x, interval));
      const disconnected_intervals = merged_intervals.filter(x => !areConnected(x, interval));
      return [
        ...disconnected_intervals,
        mergeIntervals([...connected_intervals, interval], limited),
      ];
    }, []);
  return merged_intervals;
};

// A
const intervals = getCoverage(2000000, info, false);
const coverage_size = intervals.reduce((acc, interval) => acc + interval[1] - interval[0], 0);

// B
const findMissingBeaconX = intervals => Math.min(...intervals.map(x => x[1])) + 1;

const findHiddenBeaconPosition = (info) => {
  for (let height = 0; height <= COORD_LIMIT; ++height) {
    if (height % 10000 === 0) console.log('Scanning at', height);
    const intervals = getCoverage(height, info, true);
    const coverage_size = intervals.reduce((acc, interval) => acc + 1 + interval[1] - interval[0], 0);
    if (coverage_size === COORD_LIMIT) {
      const missingBeaconX = findMissingBeaconX(intervals);
      return [missingBeaconX, height];
    }
  }
};
const hidden_beacon_pos = findHiddenBeaconPosition(info);
const tuning_freq = hidden_beacon_pos[0] * COORD_LIMIT + hidden_beacon_pos[1];
