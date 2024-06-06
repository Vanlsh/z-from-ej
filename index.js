const fs = require("node:fs/promises");
const iconv = require("iconv-lite");
const path = require("path");
const { getReportsData } = require("./parser/parseReports.js");
const { getInfo } = require("./parser/parseFP.js");
const { createReports } = require("./service/createReports.js");

const readEJ = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const content = iconv.decode(buffer, "windows-1251");
  return getReportsData(content);
};

const readFP = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  return getInfo(buffer);
};

const writeFP = async (pathFile, buffer) => {
  try {
    await fs.writeFile(pathFile, buffer); // Write the processed buffer to the output file
    console.log(`File written to ${pathFile}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

const filePath = path.join(process.cwd(), "file", "КМ00009778.TXT");
const filePathFP = path.join(process.cwd(), "file", "КМ00009778.bin");
const filePathFPNew = path.join(process.cwd(), "file", "КМ00009778new.bin");
const getNewFP = async (pathFP, pathEJ) => {
  const fpData = await readFP(pathFP);
  const ejData = await readEJ(pathEJ);
  return createReports(fpData, ejData);
};

const start = async () => {
  const buffer = await getNewFP(filePathFP, filePath);
  writeFP(filePathFPNew, buffer);
};

start();
