import * as fs from "fs";
const file = fs.readFileSync("./t2.json", "utf-8");
const data = JSON.parse(file);
console.log(data[0].alternativeSet.length);
