const path = require('path');
const fs = require('fs');

const logger = require('./logger');

const packageJson = require(path.resolve(process.cwd(), `package.json`)); // eslint-disable-line import/no-dynamic-require

/** @type {string[]} reqList */
const reqList = [];

const depsList = ['', ...Object.keys(packageJson.devDependencies), ...Object.keys(packageJson.dependencies)];

const depsFlag = depsList.every(dep => {
  try {
    const nodeModulesPath = path.resolve(process.cwd(), `node_modules/${dep}`);
    fs.readdirSync(nodeModulesPath);
  } catch (e) {
    reqList.push(dep);
    if (!dep) return false; // node_modules folder not present
  }
  return true;
});

if (reqList.length > 0) {
  if (!depsFlag) {
    logger.error('No 💩 can happen unless you run:');
    logger.warn('npm install\n');
  } else {
    logger.error('To err is human.. 🍺');
    logger.warn(`You must install: ${reqList.join(', ')}\n`);
  }
  process.exit(1);
}
