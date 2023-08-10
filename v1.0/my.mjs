import { My } from "./parser.mjs";
import { argv, exit } from "node:process";
import { readFileSync } from "node:fs";

const main = () => {
  if (argv.length < 3) {
    console.error("Usage: node ./my.mjs <FILE>");
    exit(1);
  }

  const code = readFileSync(argv[2], "utf-8");

  const program = new My(code);
  program.run();
};

main();
