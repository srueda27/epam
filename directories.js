const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));

var readline = require('readline');

var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(`Question? `);
rl.prompt();

rl.on('line', answer => {
    console.log(`Answer: ${answer}`);
    if (answer == 'EXIT') {
      process.exit(0);
    }
    rl.prompt();
}).on('close', () => {
  process.exit(0);
});
