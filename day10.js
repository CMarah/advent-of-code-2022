const input = ``;

const instructions = input.split('\n');

// Processor
const initial_state = {
  cycle: 0,
  signal_strength: 0,
  X: 1,
  image: '',
};

const signalToAdd = (cycle, X) => {
  if (cycle%40 !== 20) {
    return 0;
  }
  return cycle*X;
};

const final_state = instructions.reduce((state, instruction) => {
  const { cycle, signal_strength, X, image } = state;
  const [command, raw_v] = instruction.split(' ');
  if (command === 'addx') {
    const v = parseInt(raw_v);
    const new_image_pixel_1 = [X-1,X,X+1].includes(cycle%40) ? '#' : '.';
    const new_image_pixel_2 = [X-1,X,X+1].includes((cycle+1)%40) ? '#' : '.';
    return {
      X: X + v,
      cycle: cycle + 2,
      signal_strength: signal_strength +
        signalToAdd(cycle + 1, X) + signalToAdd(cycle + 2, X),
      image: image + new_image_pixel_1 + new_image_pixel_2,
    };
  } else {
    const new_image_pixel = [X-1,X,X+1].includes(cycle%40) ? '#' : '.';
    return {
      X,
      cycle: cycle + 1,
      signal_strength: signal_strength + signalToAdd(cycle + 1, X),
      image: image + new_image_pixel,
    };
  }
}, initial_state);

// A
const ans_A = final_state.signal_strength;

// B
const ans_B = final_state.image.slice(0,40) + '\n' +
  final_state.image.slice(40,80) + '\n' +
  final_state.image.slice(80,120) + '\n' +
  final_state.image.slice(120,160) + '\n' +
  final_state.image.slice(160,200) + '\n' +
  final_state.image.slice(200,240);
