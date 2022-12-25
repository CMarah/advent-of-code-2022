const input = ``;

const numbers = input.split('\n');

const fromSnafu = snafu => snafu.split('').reduce((result, v, index) => {
    const power = snafu.length - index - 1;
    const digit = v === '-' ? -1 :
        v === '=' ? -2 :
        Number(v);
    return result + digit * Math.pow(5, power);
}, 0);

const addNewDigit = (snafu, i) => {
    if (i === -1) return '1' + snafu;
    const raw_new_digit = Number(snafu[i]) + 1;
    if (raw_new_digit <= 4) {
        return replaceAt(snafu, i, raw_new_digit);
    }
    return addNewDigit(replaceAt(snafu, i, '0'), i - 1);
};

const replaceAt = (str, index, replacement) => {
    return str.substr(0, index) + replacement + str.substr(index + 1);
};

const toSnafu = decimal => {
    // For each digit, if 3 or more, turn to -/= and add to next digit
    let snafu = decimal.toString(5);
    for (let i = snafu.length - 1; i >= 0; --i) {
        if (['0', '1', '2'].includes(snafu[i])) {
            continue;
        } else if (snafu[i] === '3') {
            snafu = addNewDigit(
                replaceAt(snafu, i, '='),
                i - 1,
            );
        } else if (snafu[i] === '4') {
            snafu = addNewDigit(
                replaceAt(snafu, i, '-'),
                i - 1,
            );
        }
    }
    return snafu;
};

// A
const decimal_nums = numbers.map(fromSnafu);
const sum = decimal_nums.reduce((result, v) => result + v, 0);
const snafu_sum = toSnafu(sum);
