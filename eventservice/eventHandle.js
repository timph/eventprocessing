const Redis = require('ioredis');
const { isValidIPV4, isValidTimestamp } = require('./validation');

const redis = new Redis();
const QCHANNEL = 'redis-channel';

const Validation = {
  'ts': isValidTimestamp,
  'sender': Boolean,
  'message': m => Object.keys(m).length > 0,
  'sent-from-ip': isValidIPV4,
  'priority': Number,
};
const expected = Object.keys(Validation);

const enventHandle = (req, res, next) => {
  let event = req.body;
  const errors = [];
  const keys = Object.keys(event);
  if (keys.length !== expected.length) {
    errors.push('Invalid event - not same format');
  }

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== expected[i]) {
      errors.push(`Invalid event - wrong key ${keys[i]}`);
    }
    if (!Validation[keys[i]](event[keys[i]])) {
      errors.push(`Invalid event - bad '${keys[i]}' value ${event[keys[i]]}`);
    }
  }
  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    redis.publish(QCHANNEL, JSON.stringify(event));
    res.json(event);
  }

  if (next) next();
}

module.exports = enventHandle;