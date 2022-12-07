const input = ``;

const cmd_lines = input.split('\n');

// Processing
const initial_data = {
  current_dir: null,
  file_structure: { '/': {} },
}; // Dir hierarchy is denoted with a '-': a-b indicates b is inside a

const getNewDir = (prev_dir, new_dir) => {
  if (new_dir === '/') return '/';
  if (new_dir === '..') return prev_dir.split('-').slice(0, -1).join('-');
  return prev_dir + '-' + new_dir;
};

const addItem = (file_structure, current_dir, [name, item]) => {
  if (!current_dir.includes('-')) {
    // Last step, just a single dir
    file_structure[current_dir][name] = item;
    return file_structure;
  }
  const path = current_dir.split('-');
  // Multiple steps remaining
  const first_step = path[0];
  const new_relative_dir = path.slice(1).join('-');
  file_structure[first_step] = addItem(
    file_structure[first_step],
    new_relative_dir,
    [name, item],
  );
  return file_structure;
};

// Contains structure of file system
const final_state = cmd_lines.reduce(
  ({ current_dir, file_structure }, line) => {
    const words = line.split(' ');
    if (words[0] === '$') {
      // Command
      if (words[1] === 'cd') {
        return {
          current_dir: getNewDir(current_dir, words[2]),
          file_structure,
        };
      }
      if (words[1] === 'ls') {
        return {
          current_dir,
          file_structure,
        };
      }
    } else {
      // Reading info
      if (words[0] === 'dir') {
        // Found dir
        return {
          current_dir,
          file_structure: addItem(file_structure, current_dir, [words[1], {}]),
        };
      } else {
        // Found file
        return {
          current_dir,
          file_structure: addItem(file_structure, current_dir, [words[1], words[0]]),
        };
      }
    }
  },
  initial_data,
);

// For a given dir in the file system, get its and its descendant's sizes (files and dirs)
const getDirSizes = (dir_name, dir_files, current_dir) => {
  const new_current_dir = current_dir ? `${current_dir}-${dir_name}` : dir_name;
  const inner_files_sizes = Object.entries(dir_files).reduce(
    (file_sizes, [name, content]) => {
      if (typeof content === 'string') {
        // Is a file
        return {
          ...file_sizes,
          [new_current_dir + '-' + name]: { size: parseInt(content), is_dir: false },
        };
      }
      // Is a dir
      return {
        ...file_sizes,
        ...getDirSizes(name, content, new_current_dir),
      };
    }
  , {});
  const total_size = Object.keys(dir_files).reduce(
    (acc, file_name) => acc + inner_files_sizes[`${new_current_dir}-${file_name}`].size, 0
  );
  return {
    ...inner_files_sizes,
    [new_current_dir]: {
      size: total_size,
      is_dir: true,
    },
  };
};

const dir_sizes = getDirSizes('/', final_state.file_structure['/'], '');

// A
const valid_size_dirs = Object.values(dir_sizes)
  .filter(data => data.is_dir && data.size <= 100000);
const total_valid_size = valid_size_dirs
  .reduce((acc, dir) => acc + dir.size, 0);

// B
const current_free_space = 70000000 - dir_sizes['/'].size;
const needed_space = 30000000 - current_free_space;
const valid_size_dirs_B = Object.values(dir_sizes)
  .filter(data => data.is_dir && data.size >= needed_space);
const optimal_dir_size = valid_size_dirs_B.sort((a,b) => a.size - b.size)[0].size;
