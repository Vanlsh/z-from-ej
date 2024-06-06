const splitReport = (content) => {
  const data = content.split("Z - З В I Т");
  return data.slice(1, data.length);
};

const parseReport = (item) => {
  const [obig, storm] = item.split("ПОВЕРНЕНI");

  const paymentSum = getSums(obig);
  const returnedSun = getSums(storm);

  const infoReport = getReportInfo(storm);

  return { obig: paymentSum, storm: returnedSun, ...infoReport };
};

const parseObig = (obig) => {
  if (!obig) return 0;
  const value = obig[obig.length - 1];
  return Number(value.replace(",", ".")) * 100;
};

const getReportInfo = (item) => {
  const regex = /(\d{7})\s+(\d{7})\s+(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})/;
  const match = item.match(regex);

  if (match) {
    return {
      firstNumber: Number(match[1]),
      secondNumber: Number(match[2]),
      dateTime: parseDate(match[3]),
    };
  } else {
    throw new Error("Values not found");
  }
};

const parseDate = (dateTimeStr) => {
  const [dateStr, timeStr] = dateTimeStr.split(" ");
  const [day, month, year] = dateStr.split("-").map(Number);
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const dateTime = new Date(year, month - 1, day, hours, minutes, seconds);

  return dateTime;
};

const getSums = (item) => {
  const regexObigA = /ОБIГ А\s+([\d,]+)/;
  const regexObigB = /ОБIГ Б\s+([\d,]+)/;
  const regexObigC = /ОБIГ В\s+([\d,]+)/;
  const regexObigD = /ОБIГ Г\s+([\d,]+)/;
  const regexObigE = /ОБIГ Д\s+([\d,]+)/;

  const obigA = parseObig(item.match(regexObigA));
  const obigB = parseObig(item.match(regexObigB));
  const obigC = parseObig(item.match(regexObigC));
  const obigD = parseObig(item.match(regexObigD));
  const obigE = parseObig(item.match(regexObigE));

  const regexObigM = /ОБIГ М\/([*+]|Акциз)[АБВГД]\s+([\d,]+)/;
  const regexObigH = /ОБIГ Н\/([*+]|Акциз)[АБВГД]\s+([\d,]+)/;

  const obigM = parseObig(item.match(regexObigM));
  const obigH = parseObig(item.match(regexObigH));

  const regexVatObigA = /ПДВ А = \d{1,2},\d{2}%\s+([\d,]+)/;
  const regexVatObigB = /ПДВ Б = \d{1,2},\d{2}%\s+([\d,]+)/;
  const regexVatObigC = /ПДВ В = \d{1,2},\d{2}%\s+([\d,]+)/;
  const regexVatObigD = /ПДВ Г = \d{1,2},\d{2}%\s+([\d,]+)/;
  const regexVatObigE = /ПДВ Д = Неопод.\s+([\d,]+)/;

  const vatA = parseObig(item.match(regexVatObigA));
  const vatB = parseObig(item.match(regexVatObigB));
  const vatC = parseObig(item.match(regexVatObigC));
  const vatD = parseObig(item.match(regexVatObigD));
  const vatE = parseObig(item.match(regexVatObigE));

  const regexVatObigM =
    /ЗБIР М\/([*+]|Акциз)[АБВГД]\s+=\s+\d{1,2},\d{2}%\s+([\d,]+)/;
  const regexVatObigH =
    /ЗБIР Н\/([*+]|Акциз)[АБВГД]\s+=\s+\d{1,2},\d{2}%\s+([\d,]+)/;

  const vatM = parseObig(item.match(regexVatObigM));
  const vatH = parseObig(item.match(regexVatObigH));

  const regexCount = /ЧЕКIВ\s+(\d+)/;

  const count = Number(item.match(regexCount)[1]);

  return {
    count,
    obigA,
    obigB,
    obigC,
    obigD,
    obigE,
    obigM,
    obigH,
    vatA,
    vatB,
    vatC,
    vatD,
    vatE,
    vatM,
    vatH,
  };
};

// export

const getReportsData = (content) => {
  const reports = splitReport(content);
  const reportsData = reports.map(parseReport);
  return reportsData;
};

module.exports = {
  getReportsData,
};
