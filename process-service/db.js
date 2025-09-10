const { Pool } = require("pg");

// configure aqui de acordo com seu ambiente
const pool = new Pool({
  user: "localhost",
  host: "localhost",
  database: "Sistemas Distribuidos",
  password: "123456",
  port: 5432
});

module.exports = pool;
