export const checkProd = () => process.env.MODE === 'prod' || process.env.NODE_ENV === 'production';
export const checkServer = (env?: any) => env?.platform === 'server' || process.env.platform === 'server';
