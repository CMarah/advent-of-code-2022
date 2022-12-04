const input = ``;

const assignments = input.split('\n')
  .map(line => line.split(',').map(half => half.split('-').map(x => parseInt(x))));

// A
const num_fully_contained = assignments.filter(
  assignment => {
    const [ left_first, right_first   ] = assignment[0];
    const [ left_second, right_second ] = assignment[1];
    return (left_first <= left_second && right_first >= right_second) ||
      (left_first >= left_second && right_first <= right_second);
  }
).length;

// B
const partially_contained = assignments.filter(
  assignment => {
    const [ left_first, right_first   ] = assignment[0];
    const [ left_second, right_second ] = assignment[1];
    return (left_first <= left_second && right_first >= left_second) ||
      (left_second <= left_first && right_second >= left_first);
  }
).length;
