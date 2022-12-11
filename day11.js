const input = ``;

// Initial data as function to avoid inteference between runs
const initialMonkeyData = () => input.split('Monkey ')
  .filter(m => m)
  .map(m_text => {
    const lines = m_text.split('\n');
    const start = lines[1].split(': ')[1].split(', ')
      .map(i => parseInt(i));
    const op = lines[2].split(': ')[1];
    const test = [
      parseInt(lines[3].split('by ')[1]),
      parseInt(lines[4].split('monkey ')[1]),
      parseInt(lines[5].split('monkey ')[1]),
    ];
    return {
      items: start,
      op,
      test,
      num_throws: 0,
    };
  });

// To avoid extremely large numbers, mod worries by product of testing values
const global_mod = initialMonkeyData().reduce((mod, m) => mod * m.test[0], 1);

const applyOp = (worry, op, divide_worry) => {
  const raw_op_value = op.split(' ').at(-1);
  const op_value = raw_op_value === 'old' ? worry : parseInt(raw_op_value);
  const result = op.includes('+') ?
    worry + op_value :
    worry * op_value;
  return divide_worry ?
    Math.floor(result/3) :
    (result%global_mod);
};

const processMonkeyData = (initial_data, final_round, divide_worry) => {
  // Process items as described
  let monkey_data = initial_data;
  for (let round = 0; round < final_round; ++round) {
    monkey_data.forEach((monkey, monkey_index) => {
      monkey.items.forEach(item => {
        const new_worry = applyOp(item, monkey.op, divide_worry);
        if (new_worry % monkey.test[0] === 0) {
          monkey_data[monkey.test[1]].items.push(new_worry);
        } else {
          monkey_data[monkey.test[2]].items.push(new_worry);
        }
      });
      monkey_data[monkey_index].num_throws += monkey.items.length;
      monkey_data[monkey_index].items = [];
    })
  }
  return monkey_data;
};

const getMonkeyBusiness = monkey_data => {
  const worst_monkeys = monkey_data
    .sort((m1, m2) => m2.num_throws - m1.num_throws)
    .map(m => m.num_throws)
    .slice(0, 2);
  return worst_monkeys[0] * worst_monkeys[1];
};

// A
const monkey_business_A = getMonkeyBusiness(processMonkeyData(
  initialMonkeyData(), 20, true,
));

// B
const monkey_business_B = getMonkeyBusiness(processMonkeyData(
  initialMonkeyData(), 10000, false,
));
