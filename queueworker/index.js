const Redis = require('ioredis');

const redis = new Redis();
const QCHANNEL = 'redis-channel';

const { Pool } = require('pg');
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = require('./environment');

const dbclient = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
});

dbclient
  .connect()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error', err.stack));

redis.subscribe(QCHANNEL, (err, count) => {
  if (err) {
    console.error(`Failed to subscribe to ${QCHANNEL}: ${err.message}`);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${QCHANNEL} channels.`
    );
  }  
});

redis.on('message', async (channel, message) => {
  console.log(`Received ${message} from ${channel}`);
  try {
    // const event = JSON.parse(message);
    const result = await dbclient
      .query("INSERT INTO events(event) VALUES ($1) RETURNING id", [message]);
    console.log('Msg saved', result.rows[0]);
    } catch(error) {
    console.error('Message is invalid', message);
  }
});


