const input = ``;

const map_height = input.split('\n').length;
const map_width = input.split('\n')[0].length;
const map = input.split('\n').map((line) => line.split('')
    .map((char) => {
        switch (char) {
            case '#': return 16;
            case '<': return 8;
            case '>': return 4;
            case '^': return 2;
            case 'v': return 1;
            default: return 0;
        }
    })
);

const getNewCellContent = (row, col, map) => {
    if (row === 0 && col === 1) return 0;
    if (row === map_height - 1 && col === map_width - 2) return 0;
    if (row === 0 || row === map_height - 1) return 16;
    if (col === 0 || col === map_width - 1) return 16;
    const top = row === 1 ? map[map_height - 2][col] : map[row - 1][col];
    const bottom = row === map_height - 2 ? map[1][col] : map[row + 1][col];
    const left = col === 1 ? map[row][map_width - 2] : map[row][col - 1];
    const right = col === map_width - 2 ? map[row][1] : map[row][col + 1];
    let new_content = 0;
    if (top & 1) new_content |= 1;
    if (bottom & 2) new_content |= 2;
    if (left & 4) new_content |= 4;
    if (right & 8) new_content |= 8;
    return new_content;
};

const advanceMap = map => map.map((row, row_index) => row.map(
    (cell, col_index) => getNewCellContent(row_index, col_index, map)
));

const getNextNodes = (map, row, col, steps, re, rs) => {
    const possible_nodes = [
        [row - 1, col, steps + 1],
        [row + 1, col, steps + 1],
        [row, col, steps + 1],
        [row, col - 1, steps + 1],
        [row, col + 1, steps + 1],
    ];
    return possible_nodes.filter(([row, col, steps]) => {
        if (row < 0 || row >= map_height) return false;
        if (col < 0 || col >= map_width) return false;
        if (map[row][col]) return false;
        return true;
    }).map(([r, c, s]) => {
        if (r === 0 && c === 1 && re) return [r, c, s, true, true];
        if (r === map_height - 1 && c === map_width - 2) return [r, c, s, true, rs];
        return [r, c, s, re, rs];
    });
};

const getShortesPath = (initial_map, go_back) => {
    // Queue elems: [row, col, steps, reached_end, returned_to_start]
    let queue = [[0, 1, 0, false, false]];
    let next_map = advanceMap(initial_map);

    let current_steps = 0;

    while (queue.length > 0) {
        const [row, col, steps, reached_end, returned_to_start] = queue.shift();
        if (row === map_height - 1 && col === map_width - 2) {
            // Reached end
            if (!go_back) return steps;
            if (returned_to_start) return steps;
        }
        if (steps > current_steps) {
            current_steps = steps;
            next_map = advanceMap(next_map);
            // Remove duplicates
            queue = queue.filter(([row, col, steps, re, rs], i) =>
                !queue.some(([row2, col2, s2, re2, rs2], j) => i > j && row2 === row && col2 === col && re2 === re && rs2 === rs)
            );
        }
        const next_nodes = getNextNodes(next_map, row, col, steps, reached_end, returned_to_start);
        queue.push(...next_nodes);
    }
};

// A
const num_steps_end = getShortesPath(map, false);

// B
const num_steps_with_return = getShortesPath(map, true);
