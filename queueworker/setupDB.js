const { Client } = require('pg');
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = require('./environment');

const dbclient = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
});

dbclient
  .connect()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error', err.stack));

const createTable = `
CREATE TABLE IF NOT EXISTS events (
	id SERIAL NOT NULL PRIMARY KEY,
	event JSONB NOT NULL
)
`; // we replace table for repeated testing

dbclient
  .query(createTable)
  .then(res => {
    console.log('Table is setup');
    dbclient.end();
  })
  .catch(err => console.error(err));
