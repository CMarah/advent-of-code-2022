const input = ``;

// Null means unordered, keep checking
const isOrdered = (left, right) => {
  const left_is_array = Array.isArray(left);
  const right_is_array = Array.isArray(right);
  if (!left_is_array && !right_is_array) {
    // Both are numbers
    if (left === right) return null;
    return left < right;
  }
  if (left_is_array && right_is_array) {
    // Both are lists
    if (left.length === 0 && right.length === 0) return null;
    if (left.length === 0) return true;
    if (right.length === 0) return false;
    const compare_firsts = isOrdered(left[0], right[0]);
    if (compare_firsts === null) {
      return isOrdered(left.slice(1), right.slice(1));
    }
    return compare_firsts;
  }
  // One list, one number
  const new_left = left_is_array ? left : [left];
  const new_right = right_is_array ? right : [right];
  return isOrdered(new_left, new_right);
};

// A
const pairs = input.split('\n\n').map(pair => pair.split('\n').map(JSON.parse));
const pairsAreOrdered = pairs.map(([left, right]) => isOrdered(left, right));
const correct_indexes_sum = pairsAreOrdered.reduce(
  (sum, is_ordered, index) => sum + (is_ordered ? index + 1 : 0), 0,
);

// B
const div_packet_1 = [[2]];
const div_packet_2 = [[6]];
const all_packets = input.split('\n').filter(x => x)
  .map(JSON.parse)
  .concat([div_packet_1, div_packet_2]);

const lower_than_1 = all_packets.filter(packet => isOrdered(packet, div_packet_1)).length + 1;
const lower_than_2 = all_packets.filter(packet => isOrdered(packet, div_packet_2)).length + 1;
const result_B = lower_than_1 * lower_than_2;
