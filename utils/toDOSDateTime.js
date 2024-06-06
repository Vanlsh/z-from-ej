const toDOSDate = (date) => {
  const year = date.getFullYear() - 2000; // DOS date starts at 1980
  const month = date.getMonth() + 1; // Months are zero-based in JavaScript
  const day = date.getDate();

  const dosDate = (year << 9) | (month << 5) | day;
  const dateBuffer = Buffer.alloc(2);
  dateBuffer.writeUInt16LE(dosDate, 0);
  return dateBuffer;
};

const toDOSTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2); // DOS time stores seconds divided by 2

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const timeBuffer = Buffer.alloc(2);
  timeBuffer.writeUInt16LE(dosTime, 0);
  return timeBuffer;
};

const toDOSDateTime = (date) => {
  const dateBuffer = toDOSDate(date);
  const timeBuffer = toDOSTime(date);

  return Buffer.concat([timeBuffer, dateBuffer]);
};

module.exports = { toDOSDateTime };
