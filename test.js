const numberToFiveBytesLE = (num) => {
  const buffer = Buffer.alloc(5); // Allocate a 5-byte buffer

  // Convert the number to a string and split it into individual bytes
  const bytes = num
    .toString(16)
    .padStart(10, "0")
    .match(/.{1,2}/g)
    .reverse();

  // Write the bytes to the buffer
  for (let i = 0; i < 5; i++) {
    buffer[i] = parseInt(bytes[i] || "00", 16);
  }

  return buffer;
};

// Example usage
const num = 100; // Any number you want to convert
const buffer = numberToFiveBytesLE(num);
console.log(buffer); // Output: <Buffer 64 00 00 00 00>
