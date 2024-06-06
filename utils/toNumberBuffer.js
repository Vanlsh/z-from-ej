const numberToTwoBytesLE = (num) => {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(num, 0);
  return buffer;
};

const numberToFourBytesLE = (num) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(num, 0);
  return buffer;
};

const numberToFiveBytesLE = (num) => {
  const buffer = Buffer.alloc(5);

  const bytes = num
    .toString(16)
    .padStart(10, "0")
    .match(/.{1,2}/g)
    .reverse();

  for (let i = 0; i < 5; i++) {
    buffer[i] = parseInt(bytes[i] || "00", 16);
  }

  return buffer;
};

module.exports = {
  numberToTwoBytesLE,
  numberToFourBytesLE,
  numberToFiveBytesLE,
};
