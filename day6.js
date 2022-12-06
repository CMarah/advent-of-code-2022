const input = ``;

const areDifferent = char_list => char_list.every(
  (c, i) => char_list.every((c2, j) => i === j || c !== c2)
);

// A
const first_marker_index = input.split('').findIndex(
  (_, i) => areDifferent(input.split('').slice(i, i + 4))
) + 4;

// B
const first_marker_index_14 = input.split('').findIndex(
  (_, i) => areDifferent(input.split('').slice(i, i + 14))
) + 14;
