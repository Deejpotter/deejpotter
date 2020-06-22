const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  env: process.env.env,
  connectionString: process.env.connectionString,
  port: process.env.port
};