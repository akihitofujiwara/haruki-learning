const { REACT_APP_ENV: ENV = 'development' } = process.env;

export default function env(key) {
  return process.env[`REACT_APP_${ENV.toUpperCase()}_${key}`];
};
