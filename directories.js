const readline = require('readline');
const chalk = require('chalk');

const utilsService = require('./services/utilsService');

const rl = readline.createInterface(process.stdin, process.stdout);

const insertCommandText = 'Please insert your command: ';
const usageText = `
usage:
  <command> 

  commands can be:

  EXIT:                                   used to exit the app
  LIST:                                   used to list all folders
  CREATE <folder_name>:                   used to create a new folder
  DELETE <folder_name>:                   used to delete a folder
  MOVE <folder_name> <parent_folder>:     used to move a folder into a parent folder
`;
let initial_folder = '';

rl.setPrompt(insertCommandText);
rl.prompt();

rl.on('line', answer => {
  if (answer === 'EXIT') {
    process.exit(0);
  }

  const valid = utilsService.validateAnswer(answer);

  if (!valid.success) {
    console.log(chalk.red(valid.message));
    console.log(chalk.white(usageText));
  } else {

    if (!initial_folder) {
      const initFolder = utilsService.initFolder();

      if (initFolder.success) {
        initial_folder = initFolder.message;
      } else {
        console.log(chalk.red(initFolder.message));
      }
    }

    const response = utilsService.proccessCommands(initial_folder, valid.message);

    if (response.success) {
      console.log([response.message]);
      console.log(chalk.blue(response.message))
    } else {
      console.log(chalk.red(response.message))
    }
  }

  rl.prompt();
})
  .on('close', () => {
    process.exit(0);
  });
