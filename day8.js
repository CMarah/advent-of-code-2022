const input = ``;

const lines = input.split('\n');

const tree_rows = lines.map(line => line.split('').map(x => parseInt(x)));

const tree_cols = (new Array(lines[0].length)).fill(0)
  .map((_, i) => lines.map(line => parseInt(line[i])));

// A
const visibilities = tree_rows.map(
  (row, row_index) => tree_cols.map(
    (col, col_index) => {
      const h = col[row_index];
      return row.slice(0, col_index).every(h2 => h2 < h) ||
        row.slice(col_index + 1).every(h2 => h2 < h) ||
        col.slice(0, row_index).every(h2 => h2 < h) ||
        col.slice(row_index + 1).every(h2 => h2 < h);
    }
  )
);

const total_visible = visibilities.reduce(
  (row_acc, row) => row_acc + row.reduce(
    (acc, visible) => acc + (visible ? 1 : 0), 0
  ), 0
);

// B
const countVisible = (values, cutoff) => {
  const index_last_seen = values.findIndex(h => h >= cutoff);
  if (index_last_seen === -1) return values.length;
  return index_last_seen + 1;
};

const scenic_scores = tree_rows.map(
  (row, row_index) => tree_cols.map(
    (col, col_index) => {
      const cutoff = col[row_index];
      const directions = [
        row.slice(0, col_index).reverse(),
        row.slice(col_index + 1),
        col.slice(0, row_index).reverse(),
        col.slice(row_index + 1),
      ];
      return directions.reduce((acc, dir) => acc * countVisible(dir, cutoff), 1);
    }
  )
);

const max_scenic_score = Math.max(
  ...scenic_scores.map(scores_row => Math.max(...scores_row))
);
