const { isValidIPV4, isValidTimestamp, hasValidKeys } = require('./validation');
const Validation = {
  'ts': isValidTimestamp,
  'sender': Boolean,
  'message': m => Object.keys(m).length > 0,
  'sent-from-ip': isValidIPV4,
  'priority': Number,
};
const expected = Object.keys(Validation);

// console.log(!!Validation['sender'](''));
// console.log(!!Validation['sender']('name'));
// console.log(!!Validation['priority'](''));
// console.log(!!Validation['priority']('a1'));
// console.log(!!Validation['priority']('123'));
// console.log(!!Validation['priority'](123));
// console.log(!!Validation['message']({ id: 1 }));

const enventHandle = (req, res, next) => {
  let body = req.body;
  const errors = [];
  const keys = Object.keys(body);
  if (keys.length !== expected.length) {
    errors.push('Invalid event - not same format');
  }

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== expected[i]) {
      errors.push(`Invalid event - wrong key ${keys[i]}`);
    }
    if (!Validation[keys[i]](body[keys[i]])) {
      errors.push(`Invalid event - bad '${keys[i]}' value ${body[keys[i]]}`);
    }
  }
  if (errors.length > 0) {
    res.status(401).send(errors);
  } else {
    res.json(body);
  }

  if (next) next();
}

module.exports = enventHandle;