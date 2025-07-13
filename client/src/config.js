const getEnv = () => {
  return process.env.NODE_ENV === "production" ? "production" : "development";
};

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  env: getEnv(),
};

export default config;
