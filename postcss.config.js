const plugins = [
  'autoprefixer',
  'postcss-preset-env',
];

if (process.env.MODE === 'prod') {
  plugins.push('cssnano'); // should be last in plugins array
}

module.exports = {
  plugins
};
