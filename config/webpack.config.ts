import path from 'path';
import webpack, { Configuration, ConfigurationFactory, Entry, Plugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import dev from './webpack.dev';
import { checkProd, checkServer } from '../src/utils/env.utils';

const common: ConfigurationFactory = (env: any) => {
  const isProd = checkProd();
  const isServer = checkServer(env);

  const buildRoot = 'build';
  const outFolder = isServer ? `${buildRoot}/server` : `${buildRoot}/public`;

  const outputFileName = '[name].js';
  const chunkFilename = '[name].chunk.js';

  const miniCssFileName = 'style.css';
  const miniCssChunkName = '[name].chunk.css';

  const assetName = '[name].[ext]';

  const envConfig: Configuration = {};

  if (isServer) {
    envConfig.target = 'node'; // Target node environment on server (ignore built-in modules like path, fs, etc.)
    envConfig.externals = [nodeExternals()]; // No need to bundle node_modules folder for backend/server
  } else {
    envConfig.node = { fs: 'empty' }; // Don't provide node module polyfills in non-node environment
  }

  const plugins: Plugin[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env`) }),
    new MiniCssExtractPlugin({
      filename: `assets/css/${miniCssFileName}`,
      chunkFilename: `assets/css/${miniCssChunkName}`,
    }),
  ];

  if (isServer) {
    plugins.push(new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }));
  } else {
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
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

  const cssLoader = (nextCount: number, modules?: boolean) => {
    if (!modules) {
      return 'css-loader';
    }
    return ({
      loader: 'css-loader',
      options: {
        importLoaders: nextCount,
        esModule: true,
        modules: {
          namedExport: true,
          exportLocalsConvention: 'camelCaseOnly',
          localIdentName: isProd ? '[local]_[hash:base64:5]' : '[name]__[local]__[hash:base64:5]',
        },
      }
    });
  };

  const styleLoader = (modules?: boolean) => {
    if (!modules) {
      return 'style-loader';
    }
    return ({
      loader: 'style-loader',
      options: {
        esModule: true,
        modules: {
          namedExport: true,
        },
      },
    });
  };

  const cssExtractLoader = (modules?: boolean) => {
    if (!modules) {
      return MiniCssExtractPlugin.loader;
    }
    return ({
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: true,
        modules: {
          namedExport: true,
        },
      },
    });
  };

  const postcssLoader = () => {
    return ({
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(process.cwd(), 'postcss.config.js'),
        },
      },
    });
  };

  const getStyleLoaders = (modules?: boolean) => {
    const nextLoaders = [postcssLoader(), 'sass-loader'];
    const loaders: any[] = [cssLoader(nextLoaders.length, modules), ...nextLoaders];
    if (!isServer) {
      if (!isProd) {
        loaders.unshift(styleLoader(modules));
      } else {
        loaders.unshift(cssExtractLoader(modules));
      }
    } else if (!isProd) {
      // Extract css for dev build [for debugging purpose]
      loaders.unshift(cssExtractLoader(modules));
    }
    return loaders;
  };

  const entry: Entry = isServer ? {
    index: './src/index.ts'
  } : {
    client: './src/client.tsx'
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
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        src: path.resolve(process.cwd(), 'src/'),
        starter: path.resolve(process.cwd(), 'starter/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.s?css$/,
          use: [...getStyleLoaders()],
          exclude: /\.module\.s?css$/
        },
        {
          test: /\.module\.s?css$/,
          use: [...getStyleLoaders(true)]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `assets/images/${assetName}`,
                emitFile: !isServer,
              }
            },
          ],
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
