const expect = require('expect');
const { isValidIPV4, isValidTimestamp } = require('../validation');
const validEvent = require('./event.json');

const Validation = {
  'ts': isValidTimestamp,
  'sender': Boolean,
  'message': m => Object.keys(m).length > 0,
  'sent-from-ip': isValidIPV4,
  'priority': Number,
};

describe('validation of', function() {
  it('keys should be all the same', function() {
    expect(Object.keys(validEvent)).toEqual(Object.keys(Validation));
  });
  
  it('timestamp should be valid', function() {
    expect(isValidTimestamp(1623358926976)).toEqual(true);
    expect(isValidTimestamp("1623358926976")).toEqual(true);
    expect(isValidTimestamp("a")).toEqual(false);
    expect(isValidTimestamp("a1623358926976")).toEqual(false);
  });
  
  it('IPV4 address should be correct', function() {
    let samples = ['0.0.0.0', '255.255.255.255', '127.0.0.1', 'a','12.a.b1.c2', '12.02.01.01','12.13', '312.01.01.12','1002.12.12.501','127.12.12.12'];
    expect(samples.filter(isValidIPV4)).toEqual(['0.0.0.0', '255.255.255.255', '127.0.0.1', '127.12.12.12']);
  })

  it('each field should be correct', function() {
    expect(!!Validation['sender']('')).toBe(false);
    expect(!!Validation['sender']('name')).toBe(true);
    expect(!!Validation['priority']('')).toBe(false);
    expect(!!Validation['priority']('a1')).toBe(false);
    expect(!!Validation['priority']('123')).toBe(true);
    expect(!!Validation['priority'](123)).toBe(true);
    expect(!!Validation['message']({})).toBe(false);  
    expect(!!Validation['message']({ id: 1 })).toBe(true);  
    expect(!!Validation['message']({ id: 1, name: 'test' })).toBe(true);  
  });

});

