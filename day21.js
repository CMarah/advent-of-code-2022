const input_a = ``;

const base_monkey_data = Object.fromEntries(
  input_a.split('\n').map(line => {
    const [ key, value ] = line.split(': ');
    if (Number(value)) return [ key, Number(value) ];
    const [ left, operator, right ] = value.split(' ');
    return [ key, { left, operator, right } ];
  })
);

const getResolvedNumbers = monkey_data => Object.fromEntries(
  Object.entries(monkey_data).filter(([, value ]) => typeof value === 'number')
);

// Cache containing resolved values, starting with already present numbers
let resolved_numbers = getResolvedNumbers(base_monkey_data);

const getMonkeyNumber = (monkey, all_monkeys_data) => {
  if (resolved_numbers[monkey] >= 0) return resolved_numbers[monkey];
  const monkey_data = all_monkeys_data[monkey];
  const { left, operator, right } = monkey_data;
  const left_value = getMonkeyNumber(left, all_monkeys_data);
  const right_value = getMonkeyNumber(right, all_monkeys_data);
  const value = (() => {
    if (operator === '+') return left_value + right_value;
    if (operator === '-') return left_value - right_value;
    if (operator === '*') return left_value * right_value;
    if (operator === '/') return left_value / right_value;
  })();
  resolved_numbers[monkey] = value;
  return value;
};

// A
const monkey_number_A = getMonkeyNumber('root', base_monkey_data);

// B
const ME = 'humn';
const transform_monkey_data = monkey_data => {
  let monkey_to_process = ME;
  let already_processed = [];
  let new_monkey_data = { ...monkey_data };
  new_monkey_data['root'].operator = '-';

  while (monkey_to_process !== 'root') {
    const related_monkey = Object.entries(new_monkey_data).find(([key, value]) =>
      !already_processed.includes(key) &&
      (value.left === monkey_to_process || value.right === monkey_to_process)
    );
    const [ key, value ] = related_monkey;
    const is_left = value.left === monkey_to_process;
    if (is_left) {
      const new_op = value.operator === '+' ? '-' :
        value.operator === '-' ? '+' :
        value.operator === '*' ? '/' : '*';
      new_monkey_data[monkey_to_process] = {
        left: key,
        operator: new_op,
        right: value.right,
      };
    } else {
      if (value.operator === '+' || value.operator === '*') {
        const new_op = value.operator === '+' ? '-' : '/';
        new_monkey_data[monkey_to_process] = {
          left: key,
          operator: new_op,
          right: value.left,
        };
      } else {
        const new_op = value.operator === '-' ? '-' : '/';
        new_monkey_data[monkey_to_process] = {
          left: value.left,
          operator: new_op,
          right: key,
        };
      }
    }
    already_processed.push(monkey_to_process);
    monkey_to_process = key;
  }

  new_monkey_data['root'] = 0;
  return new_monkey_data;
};

const monkey_data_B = transform_monkey_data(base_monkey_data);
resolved_numbers = getResolvedNumbers(monkey_data_B);

const monkey_number_B = getMonkeyNumber(ME, monkey_data_B);
