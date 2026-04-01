const mysql2 = require('mysql2')
require('dotenv').config()

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ka_ngea',
  port: process.env.PORT_DB || 3306
})

module.exports = pool.promise()