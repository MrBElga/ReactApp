import mysql from "mysql2/promise";

function conectar() {
  if (global.pool) {
    return global.pool.getConnection();
  }

  const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "loja",
    password: "",
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, 
    idleTimeout: 60000,
    queueLimit: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  global.pool = pool;
  return global.pool.getConnection();
}

export default conectar;
