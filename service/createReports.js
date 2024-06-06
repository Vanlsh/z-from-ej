const { toDOSDateTime } = require("../utils/toDOSDateTime.js");
const {
  numberToTwoBytesLE,
  numberToFourBytesLE,
  numberToFiveBytesLE,
} = require("../utils/toNumberBuffer.js");

const { sumBufferAndGetLastByte } = require("../utils/culcCheckSum.js");

const getBufferSum = (report) => {
  const { obig, storm } = report;
  const arr = [
    obig.obigA,
    obig.obigB,
    obig.obigC,
    obig.obigD,
    obig.obigE,

    storm.obigA,
    storm.obigB,
    storm.obigC,
    storm.obigD,
    storm.obigE,

    obig.vatA,
    obig.vatB,
    obig.vatC,
    obig.vatD,
    obig.vatE,

    storm.vatA,
    storm.vatB,
    storm.vatC,
    storm.vatD,
    storm.vatE,

    obig.obigM,
    obig.obigH,

    storm.obigM,
    storm.obigH,

    obig.vatM,
    obig.vatH,

    storm.vatM,
    storm.vatH,
  ];

  const data = arr.map((item) => numberToFiveBytesLE(item));
  return Buffer.concat(data);
};

const getCount = (arr, date) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > date) return count;

    count = i;
  }
  return count;
};
const getCountOfNums = (fpData, currentDate) => {
  const { fns, pn, vat } = fpData;
  const currentDateMS = currentDate.getTime();
  const fnCount = getCount(fns, currentDateMS);
  const pnCount = getCount(pn, currentDateMS);
  const vatCount = getCount(vat, currentDateMS);
  return Buffer.from([fnCount, pnCount, vatCount]);
};

const createReports = (fpData, ejData) => {
  const reports = ejData.map((report, index) => {
    console.log(report);
    const ZNumber = numberToTwoBytesLE(index + 1);
    const date = toDOSDateTime(report.dateTime);

    const lastDocument = numberToFourBytesLE(report.firstNumber);
    const fiscalCount = numberToTwoBytesLE(report.obig.count);
    const stornoCount = numberToTwoBytesLE(report.storm.count);
    const KSEFnum = numberToTwoBytesLE(1);

    const sum = getBufferSum(report);

    const salesMode = Buffer.from([0x00]);
    const countOfNums = getCountOfNums(fpData, report.dateTime);
    const ramReset = Buffer.from([0xff]);

    const data = [
      ZNumber,
      date,
      lastDocument,
      fiscalCount,
      stornoCount,
      KSEFnum,
      sum,
      salesMode,
      countOfNums,
      ramReset,
    ];

    const buffer = Buffer.concat(data);
    const checkSum = Buffer.from([sumBufferAndGetLastByte(buffer)]);
    return Buffer.concat([buffer, checkSum]);
  });

  const result = Buffer.concat(reports);
  const restOfLine = 16 - (result.length % 16);
  const testField = Buffer.alloc(256);
  const rest = Buffer.alloc(restOfLine + 16 * 4);

  testField.fill(0xff);
  rest.fill(0xff);

  return Buffer.concat([fpData.buffer, testField, result, rest]);
};

module.exports = {
  createReports,
};
