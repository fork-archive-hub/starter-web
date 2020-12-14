import path from 'path';
import { ConfigurationFactory, Plugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
import CompressionPlugin from 'compression-webpack-plugin';

import { checkServer } from '../src/utils/env.utils';
import { COMPRESSION_FILES_REGEX } from '../starter/const';

const prodConfig: ConfigurationFactory = (env: any) => {
  const isServer = checkServer(env);

  const plugins: Plugin[] = [
    new Dotenv({ path: path.resolve(process.cwd(), `env/.env.prod`) }),
  ];

  if(!isServer) {
    plugins.push(
      new CompressionPlugin({
        test: COMPRESSION_FILES_REGEX,
        algorithm: 'gzip',
        filename: '[path][base].gz',
      }),
      new CompressionPlugin({
        test: COMPRESSION_FILES_REGEX,
        algorithm: 'brotliCompress',
        filename: '[path][base].br',
      })
    );
  }

  return ({
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              let packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              if (packageName === 'react' || packageName === 'react-dom') {
                return 'vendor.react';
              } else {
                return 'vendor.other';
              }
              // return `vendor.${packageName.replace('@', '')}`;
            },
          },
        },
      }
    },
    plugins,
  });
};

export default prodConfig;
