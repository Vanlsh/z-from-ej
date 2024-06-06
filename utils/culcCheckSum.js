const sumBufferAndGetLastByte = (buffer) => {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i];
  }
  // Take the last byte of the sum
  const lastByte = sum & 0xff;
  return lastByte;
};

module.exports = { sumBufferAndGetLastByte };
