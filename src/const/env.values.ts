import { EnvValues } from 'src/core/models/common.model';
import { checkProd, checkServer } from 'src/utils/env.utils';
import logger from 'starter/logger';

const values: EnvValues = {
  port: process.env.PORT || '',
  portApi: process.env.PORT_API || '',
  apiBaseUrl: process.env.API_BASE_URL || '',
};

const isProd = checkProd();
const isServer = checkServer();

if (isProd && isServer) {
  values.apiBaseUrl = `http://localhost:${values.portApi}`;
}

Object.keys(values).forEach(key => {
  if (!values[key]) {
    logger.warn(`Missing env value for key: ${key}`);
  }
});

export default values;
