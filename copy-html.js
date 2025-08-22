import fs from "fs";
import path from "path";

const source = path.resolve("dist", "index.html");
const target = "/Volumes/Koushik/GitHub/ortoni-report/dist/index.html";

fs.copyFileSync(source, target);
console.log(`✅ index.html copied to ${target}`);
