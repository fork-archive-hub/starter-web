exports.checkProd = () => process.env.MODE === 'prod' || process.env.NODE_ENV === 'production';
exports.checkServer = (env) => !!env && env.platform === 'server';
