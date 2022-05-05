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

  const valid_arr = utilsService.validate(answer);

  if (!valid_arr) {
    console.log(chalk.red(usageText));
  } else {
    
    if(!initial_folder) {
      initial_folder = utilsService.initFolder();
    }

    utilsService.proccessCommands(initial_folder, valid_arr);
  }
  
  rl.prompt();
})
  .on('close', () => {
    process.exit(0);
  });
