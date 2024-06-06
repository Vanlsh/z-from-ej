const iconv = require("iconv-lite");
const { parseDOSDateTime } = require("./parseDateBuffer");

const getDate = (buffer, size, count) => {
  const dates = [];
  const SIZE = size;

  for (let i = 0; i < count; i++) {
    const offset = SIZE * i;
    const fn = buffer.slice(offset, offset + 4);
    const isEmpty = fn.every((byte) => byte === 0xff);

    if (isEmpty) return dates;

    dates.push(parseDOSDateTime(fn).getTime());
  }
  return dates;
};

const getInfo = (buffer) => {
  const part = buffer.slice(0, 2304);

  const sn = iconv.decode(buffer.slice(101, 111), "windows-1251");
  const FNbuffer = buffer.slice(256, 512);
  const vatBuffer = buffer.slice(512, 1024);
  const PNbuffer = buffer.slice(2048, 2304);

  const fns = getDate(FNbuffer, 32, 8);
  const vat = getDate(vatBuffer, 20, 16);
  const pn = getDate(PNbuffer, 24, 10);

  return { buffer: part, sn, fns, vat, pn };
};

module.exports = { getInfo };
