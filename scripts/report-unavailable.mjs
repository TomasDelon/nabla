const [, , commandName, reason] = process.argv;

console.error(`${commandName} is unavailable: ${reason}`);
process.exit(1);
