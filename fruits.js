const chalk = require('chalk');
const utilsService = require('./services/utilsService');

function testApp() {
  const initFolder = utilsService.initFolder();
  const initialFolder = initFolder.message;

  let message = 'CREATE fruits';
  let valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'CREATE vegetables';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'CREATE grains';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'CREATE fruits/apples';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'CREATE fruits/apples/fuji';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'LIST';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);
  
  message = 'CREATE grains/squash';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'MOVE grains/squash vegetables';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'CREATE foods';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'MOVE grains foods';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'MOVE fruits foods';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  message = 'MOVE vegetables foods';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);
  
  message = 'LIST';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);
  
  message = 'DELETE fruits/apples';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);
  
  message = 'DELETE foods/fruits/apples';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);
  
  message = 'LIST';
  valid = utilsService.validateAnswer(message);
  console.log(utilsService.proccessCommands(initialFolder, valid.message).message);

  console.log(`${chalk.blue('You can find the final folder inside')} ${chalk.green(initialFolder)}`)
}

testApp();