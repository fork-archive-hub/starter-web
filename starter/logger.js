const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  fg: {
    Red: '\x1b[31m',
    Yellow: '\x1b[33m',
    Green: '\x1b[32m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
  },
};

/**
 * @param {any[]} msg
 * @param {string} type
 */
const print = (msg, type, newline = false, padding = 0) => {
  let color = colors.fg.Blue;
  if (type === 'log') color = colors.fg.Green;
  else if (type === 'warn') color = colors.fg.Yellow;
  else if (type === 'error') color = colors.fg.Red;
  else if (type === 'cyan') color = colors.fg.Cyan;

  if (process.stdout) {
    process.stdout.write('  ');
    if (padding) process.stdout.write(' '.repeat(padding));
    process.stdout.write(color);
    process.stdout.write(colors.Bright);
    msg.forEach((item, idx) => {
      if (typeof item === 'number' || typeof item === 'string') {
        process.stdout.write(item + '');
      } else {
        process.stdout.write(`\n${JSON.stringify(item, null, 2)}`);
      }
      if (idx < msg.length - 1) process.stdout.write(' ');
    });
    process.stdout.write(colors.Reset);
    if (newline) process.stdout.write('\n');
  } else {
    let log = '';
    msg.forEach((item, idx) => {
      if (typeof item === 'number' || typeof item === 'string') {
        log += item + '';
      } else {
        log += `\n${JSON.stringify(item, null, 2)}`;
      }
      if (idx < msg.length - 1) log += ' ';
    });
    if (type === 'warn') console.warn(log);
    else if (type === 'error') console.error(log);
    else console.log(log);
  }
};

/** @param {any[]} msg */
exports.log_ = (...msg) => print(msg, 'log');

/** @param {any[]} msg */
exports.warn_ = (...msg) => print(msg, 'warn');

/** @param {any[]} msg */
exports.error_ = (...msg) => print(msg, 'error');

/** @param {any[]} msg */
exports.cyan_ = (...msg) => print(msg, 'cyan');

/** @param {any[]} msg */
exports.log = (...msg) => print(msg, 'log', true);

/** @param {any[]} msg */
exports.warn = (...msg) => print(msg, 'warn', true);

/** @param {any[]} msg */
exports.error = (...msg) => print(msg, 'error', true);

/** @param {any[]} msg */
exports.cyan = (...msg) => print(msg, 'cyan', true);
