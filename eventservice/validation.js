function isValidIPV4(ip) {
  // let reserved = ['0.0.0.0', '255.255.255.255', '127.0.0.1'].includes(ip);
  // if (reserved) {
  //    return false;
  // }
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }
  for (let p of parts) {
    if (p.length > 1 && p.startsWith('0')) {
      return false;
    }
    const num = parseInt(p);
    if (isNaN(num) || num > 255 || num < 0) {
      return false;
    }
  }
  return true;
}

function isValidTimestamp(ts) {
  return (new Date(Number(ts))).getTime() > 0;
}

module.exports = { isValidIPV4, isValidTimestamp }
