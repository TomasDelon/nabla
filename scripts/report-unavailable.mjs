const [, , commandName, ...rest] = process.argv;
const silent = rest.includes("--silent");
const reason = rest.filter((r) => r !== "--silent").join(" ");

if (silent) {
  console.log(`${commandName} is unavailable: ${reason}`);
  process.exit(0);
}

console.error(`${commandName} is unavailable: ${reason}`);
process.exit(1);
