import { createPool } from "mysql2";

const pool = createPool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || 'root',
    database: process.env.DATABASE || 'ka_ngea',
    port: process.env.PORT_DB || 3307
});
export default pool.promise();