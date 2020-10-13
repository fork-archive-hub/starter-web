import { EnvValues } from 'src/core/models/common.model';
import logger from 'starter/logger';

const values: EnvValues = {
  port: process.env.PORT || '',
  portApi: process.env.PORT_API || '',
  apiBaseUrl: process.env.API_BASE_URL || '',
};

Object.keys(values).forEach(key => {
  if (!values[key]) {
    logger.warn(`Missing env value for key: ${key}`);
  }
});

export default values;
