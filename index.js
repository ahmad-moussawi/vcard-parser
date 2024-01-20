import fs from "fs";
import { parseCard } from "./parseCard";

const filePath = process.argv[2];

if (!filePath) {
  throw new Error("File path not defined");
}

const text = fs
  .readFileSync(filePath, { encoding: "utf-8" })
  .replace(/\r\n/g, "\n");

const LINEBR = "\n";

function pad(num, count) {
  return "0".repeat(count - num.toString().length) + num;
}

const cards = text.split(`END:VCARD${LINEBR}BEGIN:VCARD`).map((card, i) => {
  return parseCard(card.trim(), true);
});

fs.writeFileSync(`./data/output.json`, JSON.stringify(cards, null, 2), {
  encoding: "utf8",
});
