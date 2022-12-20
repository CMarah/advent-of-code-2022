const input = ``;
const DECRIPTION_KEY = 811589153;

const original_file = input.split('\n').map(Number);


// Processors
const getNewIndex = (number, number_index, file_length) => {
  if (number === 0) return number_index;
  if (number > 0) {
    if (number_index + number < file_length) {
      return number_index + number;
    }
    const distance_to_end = file_length - number_index - 1;
    return getNewIndex(number - distance_to_end, 0, file_length);
  } else {
    if (number_index + number > 0) {
      return number_index + number;
    }
    return getNewIndex(number + number_index, file_length - 1, file_length);
  }
};

const updateCurrentPositions = (current_positions, number_index, new_index) => {
  if (number_index === new_index) return current_positions;
  if (number_index < new_index) {
    // Move items backwards
    return current_positions.map(pos => {
      if (pos < number_index) return pos;
      if (pos > new_index) return pos;
      if (pos === number_index) return new_index;
      return pos - 1;
    });
  }
  // Move items forwards
  return current_positions.map(pos => {
    if (pos < new_index) return pos;
    if (pos > number_index) return pos;
    if (pos === number_index) return new_index;
    return pos + 1;
  });
};

const mixFile = (file, num_mixes) => {
  let mixed_file = file.slice();
  let current_positions = file.map((_, i) => i); // Current pos of original file's numbers
  
  for (let i = 0; i < num_mixes; i++) {
    // Single mixing process, move numbers one by one
    mixed_file = file.reduce((mixed_file, number, i) => {
      const number_index = current_positions[i];
      const new_index = getNewIndex(number, number_index, file.length);
      current_positions = updateCurrentPositions(current_positions, number_index, new_index);
      const file_without_numb = [
        ...mixed_file.slice(0, number_index),
        ...mixed_file.slice(number_index + 1),
      ];
      return [
        ...file_without_numb.slice(0, new_index),
        number,
        ...file_without_numb.slice(new_index),
      ];
    }, mixed_file);
  }

  return mixed_file;
};

// A
const mixed_file_A = mixFile(original_file, 1);
const index_of_0 = mixed_file_A.indexOf(0);
const coords = [
  mixed_file_A[(index_of_0 + 1000)%mixed_file_A.length],
  mixed_file_A[(index_of_0 + 2000)%mixed_file_A.length],
  mixed_file_A[(index_of_0 + 3000)%mixed_file_A.length],
];
const coords_sum = coords.reduce((sum, coord) => sum + coord, 0);

// B
const semi_decrypted_file = original_file.map(n => n*(DECRIPTION_KEY%(original_file.length - 1)));
const mixed_file_B = mixFile(semi_decrypted_file, 10);
const truly_decrypted_mixed_file = mixed_file_B.map(
  n => n/(DECRIPTION_KEY%(original_file.length - 1))*DECRIPTION_KEY
);
const index_of_0_B = truly_decrypted_mixed_file.indexOf(0);
const coords_B = [
  truly_decrypted_mixed_file[(index_of_0_B + 1000)%truly_decrypted_mixed_file.length],
  truly_decrypted_mixed_file[(index_of_0_B + 2000)%truly_decrypted_mixed_file.length],
  truly_decrypted_mixed_file[(index_of_0_B + 3000)%truly_decrypted_mixed_file.length],
];
const coords_sum_B = coords_B.reduce((sum, coord) => sum + coord, 0);
