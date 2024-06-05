const fs = require("node:fs/promises");
const iconv = require("iconv-lite");
const path = require("path");
const { getReportsData } = require("./parser/parseReports.js");

const readEJ = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const content = iconv.decode(buffer, "windows-1251");
  getReportsData(content);
};

const filePath = path.join(process.cwd(), "file", "КМ00009778.TXT");
readEJ(filePath);
