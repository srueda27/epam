'use strict';
const readline = require('readline');
const chalk = require('chalk');

const utilsService = require('./services/utilsService');
const { Directory } = require('./classes/directory');

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
let initial_folder;

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

      initial_folder = initFolder.folder;
    }

    const response = utilsService.proccessCommands(initial_folder, valid.message);

    switch (response.operation) {
      case 'create':
        console.log(chalk.green(response.message));
        break;
      case 'list':
        console.log(response.message);
        break;
      case 'delete':
      case 'move':
        if (response.success) {
          console.log(chalk.green(response.message));
        } else {
          console.log(chalk.red(response.message));
        }
        break;
    }
  }

  rl.prompt();
})
  .on('close', () => {
    process.exit(0);
  });
