import path from 'path';
import webpack, { Configuration, ConfigurationFactory, Entry } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';

import dev from './webpack.dev';
import { checkProd, checkServer } from '../src/utils/env.utils';

const common: ConfigurationFactory = (env: any) => {
  const isProd = checkProd();
  const isServer = checkServer(env);

  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const envConfig: Configuration = {};

  if (isServer) {
    envConfig.target = 'node'; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle node_modules folder for backend/server
  } else {
    envConfig.node = { fs: 'empty' }; // Don't provide node module polyfills in non-node environment
  }

  const plugins = [];

  if (isServer) {
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }));
  }

  let devtool: Configuration['devtool'] = false;
  if (!isServer && !isProd) {
    devtool = 'inline-source-map';
  }

  const stats = {
    // timings: false,
    hash: false,
    version: false,
    builtAt: false,
    assets: false,
    entrypoints: false,
    modules: false,
    chunks: true,
    children: false
  };

  const entry: Entry = isServer ? {
    index: './src/index.ts'
  } : {
    client: './src/client.ts'
  };

  return ({
    entry,
    output: {
      filename: outputFileName,
      chunkFilename: chunkFilename,
      path: path.resolve(process.cwd(), outFolder),
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
      ]
    },
    watchOptions: {
      ignored: /node_modules/
    },
    devtool,
    stats,
    plugins,
    ...envConfig
  });
};

const config: ConfigurationFactory = (env: any = {}) => {
  const commonConfig = common(env, {}) as Configuration;
  const envConfig = dev(env, {}) as Configuration;
  return merge(commonConfig, envConfig);
};

export default config;
