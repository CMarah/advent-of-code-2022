const input_2 = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const input_a = `Valve TM has flow rate=3; tunnels lead to valves WB, PE, DX, TK, CH
Valve ST has flow rate=21; tunnels lead to valves NS, DE, UX, XU
Valve IX has flow rate=0; tunnels lead to valves DK, LR
Valve OG has flow rate=0; tunnels lead to valves MN, FK
Valve FR has flow rate=0; tunnels lead to valves JQ, GS
Valve HU has flow rate=0; tunnels lead to valves TJ, XX
Valve WC has flow rate=15; tunnel leads to valve TJ
Valve JT has flow rate=0; tunnels lead to valves OV, AA
Valve DW has flow rate=0; tunnels lead to valves FK, AA
Valve RG has flow rate=0; tunnels lead to valves PS, DK
Valve JQ has flow rate=14; tunnels lead to valves VM, FR
Valve XX has flow rate=5; tunnels lead to valves GP, MN, WB, LM, HU
Valve IN has flow rate=11; tunnels lead to valves OK, GS, DU
Valve LR has flow rate=7; tunnels lead to valves IX, NR, YY, HZ, PR
Valve TK has flow rate=0; tunnels lead to valves TM, OV
Valve VM has flow rate=0; tunnels lead to valves KQ, JQ
Valve IC has flow rate=0; tunnels lead to valves FK, DU
Valve CH has flow rate=0; tunnels lead to valves EZ, TM
Valve OV has flow rate=10; tunnels lead to valves YW, JT, NN, TK
Valve KQ has flow rate=17; tunnels lead to valves VM, YW, CY
Valve NR has flow rate=0; tunnels lead to valves FK, LR
Valve MN has flow rate=0; tunnels lead to valves OG, XX
Valve YY has flow rate=0; tunnels lead to valves LR, LM
Valve OK has flow rate=0; tunnels lead to valves CY, IN
Valve DK has flow rate=20; tunnels lead to valves FA, RG, IX
Valve CY has flow rate=0; tunnels lead to valves KQ, OK
Valve PR has flow rate=0; tunnels lead to valves DX, LR
Valve DE has flow rate=0; tunnels lead to valves ST, EL
Valve TJ has flow rate=0; tunnels lead to valves WC, HU
Valve NS has flow rate=0; tunnels lead to valves WU, ST
Valve PE has flow rate=0; tunnels lead to valves TM, XO
Valve DU has flow rate=0; tunnels lead to valves IN, IC
Valve DX has flow rate=0; tunnels lead to valves TM, PR
Valve EQ has flow rate=0; tunnels lead to valves AA, GP
Valve AA has flow rate=0; tunnels lead to valves JT, EZ, HZ, DW, EQ
Valve WB has flow rate=0; tunnels lead to valves TM, XX
Valve PF has flow rate=23; tunnels lead to valves BP, WU
Valve FJ has flow rate=19; tunnels lead to valves DO, TY, NN, PS
Valve GP has flow rate=0; tunnels lead to valves XX, EQ
Valve FK has flow rate=4; tunnels lead to valves DW, XO, OG, IC, NR
Valve DO has flow rate=0; tunnels lead to valves XU, FJ
Valve XO has flow rate=0; tunnels lead to valves FK, PE
Valve PS has flow rate=0; tunnels lead to valves RG, FJ
Valve MD has flow rate=25; tunnel leads to valve BP
Valve EZ has flow rate=0; tunnels lead to valves CH, AA
Valve GS has flow rate=0; tunnels lead to valves IN, FR
Valve XU has flow rate=0; tunnels lead to valves DO, ST
Valve WU has flow rate=0; tunnels lead to valves PF, NS
Valve YW has flow rate=0; tunnels lead to valves OV, KQ
Valve HZ has flow rate=0; tunnels lead to valves LR, AA
Valve TY has flow rate=0; tunnels lead to valves FJ, EL
Valve BP has flow rate=0; tunnels lead to valves MD, PF
Valve EL has flow rate=18; tunnels lead to valves DE, TY
Valve UX has flow rate=0; tunnels lead to valves FA, ST
Valve FA has flow rate=0; tunnels lead to valves UX, DK
Valve NN has flow rate=0; tunnels lead to valves OV, FJ
Valve LM has flow rate=0; tunnels lead to valves XX, YY`;

const lines = input_a.split('\n');

const raw_valves = lines.reduce((vs, line) => {
  const name = line.match(/Valve (\w+)/)[1];
  const flow_rate = parseInt(line.match(/flow rate=(\d+)/)[1]);
  const connections = line.match(/valves? ([\w\s,]+)/)[1].split(', ');
  return {
    ...vs,
    [name]: {
      flow_rate,
      connections: Object.fromEntries(connections.map(c => [c, 1])),
    },
  };
}, {});
console.log(raw_valves);

// Remove any 0 flow valves
let initial_valves = raw_valves;
Object.entries(raw_valves).forEach(([name, valve]) => {
  if (valve.flow_rate > 0 || name === 'AA') return;
  delete initial_valves[name];

  // Recalculate neighbor connections
  const connections = valve.connections;
  Object.entries(connections).forEach(([neighbor, distance]) => {
    // Connect each neighbor with each other neighbor
    if (!initial_valves[neighbor]) return;
    const n_connections = initial_valves[neighbor].connections;
    delete n_connections[name];
    Object.entries(connections).forEach(([neighbor_2, distance_2]) => {
      if (neighbor_2 === neighbor) return;
      const new_distance = distance + distance_2;
      const old_distance = n_connections[neighbor_2];
      if (!old_distance || new_distance < old_distance) {
        n_connections[neighbor_2] = new_distance;
      }
    });
    initial_valves[neighbor].connections = n_connections;
  });
});
console.log(initial_valves);

// const getStepOptions = (valve_name, opened_valves, time) => {
//   const valve = initial_valves[valve_name];
//   const travel_opts = Object.entries(valve.connections).map(
//     ([tunnel, distance]) => totalPressureA(tunnel, opened_valves, time - distance)
//   );
//   if (opened_valves.includes(valve_name) || valve.flow_rate === 0) {
//     return travel_opts;
//   }
//   const opening_opt = (() => {
//     const new_opened_valves = opened_valves.concat(valve_name);
//     return totalPressureA(valve_name, new_opened_valves, time - 1)
//       + valve.flow_rate * (time - 1);
//   })();
//   return [
//     opening_opt,
//     ...travel_opts,
//   ];
// };
//
// let cache_a = {};
// const totalPressureA = (valve_name, opened_valves, time) => {
//   // Check base conditions
//   if (time <= 0) return 0;
//
//   // Check cache
//   const id = `${valve_name}-${opened_valves.sort().join('-')}-${time}`;
//   const ct = cache_a[id];
//   if (ct) return ct;
//
//   // Process step
//   const opts = getStepOptions(valve_name, opened_valves, time);
//   const best = Math.max(...opts);
//   cache_a[id] = best;
//   return best;
// };
// const most_released_A = totalPressureA('AA', [], 30);
// console.log(most_released_A)

const cloneValves = (obj) => JSON.parse(JSON.stringify(obj));

const removeOpened = (valve_name, valves) => {
  let new_valves = cloneValves(valves);
  const valve = new_valves[valve_name];

  // Recalculate neighbor connections
  const connections = valve.connections;
  Object.entries(connections).forEach(([neighbor, distance]) => {
    // Connect each neighbor with each other neighbor
    if (!new_valves[neighbor]) return;
    const n_connections = new_valves[neighbor].connections;
    delete n_connections[valve_name];
    Object.entries(connections).forEach(([neighbor_2, distance_2]) => {
      if (neighbor_2 === neighbor) return;
      const new_distance = distance + distance_2;
      const old_distance = n_connections[neighbor_2];
      if (!old_distance || new_distance < old_distance) {
        n_connections[neighbor_2] = new_distance;
      }
    });
    new_valves[neighbor].connections = n_connections;
  });
  return new_valves;
};

const getDoubleStepOptions = (positions, opened_valves, time, next_turns, valves) => {
  const p_index = next_turns.indexOf(time); // Who's moving now
  const valve_name = positions[p_index];
  const valve = valves[valve_name];

  const travel_opts = Object.entries(valve.connections)
    .map(([tunnel, distance]) => {
      let new_positions = [...positions];
      new_positions[p_index] = tunnel;
      let new_next_turns = [...next_turns];
      new_next_turns[p_index] = time - distance;
      return totalPressureB(new_positions, opened_valves, time, new_next_turns, valves);
    });
  if (opened_valves.includes(valve_name) || valve.flow_rate === 0) {
    return travel_opts;
  }
  const opening_opt = (() => {
    const new_opened_valves = opened_valves.concat(valve_name);
    let new_next_turns = [...next_turns];
    new_next_turns[p_index] = time - 1;
    return totalPressureB(positions, new_opened_valves, time, new_next_turns, valves) +
      (valve.flow_rate * (time - 1));
  })();
  return [
    opening_opt,
    ...travel_opts,
  ];
};

let cache_b = {};
const totalPressureB = (positions, opened_valves, time, next_turns, valves) => {
  // Check base conditions
  if (time <= 0) return 0;
  if (time <= (TIME-3) && !opened_valves.length) return 0;
  if (time <= 12 && !opened_valves.includes('OV')) return 0;
  if (time <= 10 && !opened_valves.includes('FJ')) return 0;
  if (opened_valves.length === 15) return 0;
  if (!next_turns.includes(time)) {
    return totalPressureB(positions, opened_valves, time - 1, next_turns, valves);
  }

  // Check cache
  const positions_id = positions.join('-');
  const id = `${positions_id}_${opened_valves.sort().join('-')}_${time}_${next_turns.join('-')}`;
  const ct = cache_b[id];
  if (ct) return ct;

  // Process step
  const opts = getDoubleStepOptions(positions, opened_valves, time, next_turns, valves);
  const best = opts.length ? Math.max(...opts) : 0;
  cache_b[id] = best;
  return best;
};
// const TIME = 16;
// const most_released_B = totalPressureB(['FJ', 'KQ'], ['FJ', 'OV', 'KQ'], TIME, [TIME, TIME-1], cloneValves(initial_valves))
//   + initial_valves['OV'].flow_rate * (TIME+5)
//   + initial_valves['FJ'].flow_rate * (TIME+1)
//   + initial_valves['KQ'].flow_rate * (TIME-2);
// console.log(most_released_B)

const TIME = 24;
const most_released_B = totalPressureB(['EL', 'LR'], ['EL', 'FJ', 'OV', 'LR'], TIME, [TIME-7, TIME-1], cloneValves(initial_valves))
  + initial_valves['OV'].flow_rate * (TIME-1)
  + initial_valves['LR'].flow_rate * (TIME-1)
  + initial_valves['FJ'].flow_rate * (TIME-4)
  + initial_valves['EL'].flow_rate * (TIME-7)
console.log(most_released_B)
//
// const TOME = 16;
// const most_released_C = totalPressureB(['OV', 'OV'], [], TOME, [TOME, TOME], cloneValves(initial_valves))
// console.log(most_released_C)
// console.log(Object.entries(cache_b).filter(([k, v]) => v === most_released_B))
