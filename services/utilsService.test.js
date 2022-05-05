const fs = require('fs');
const path = require('path');
const utilsService = require('./utilsService');

describe('Test Basic Inputs', () => {
  test(`When entered more than 3 commands it should respond 'More than 3 parameters'`, () => {
    const answer = 'parameter parameter parameter parameter'
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('More than 3 parameters');
  });

  test(`When entered an invalid command it should respond 'Not a valid command'`, () => {
    const answer = 'parameter'
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('Not a valid command');
  });
});

describe('Create an initial folder', () => {
  test('Creates an initial folder', () => {
    const initialFolder = utilsService.initFolder();

    expect(initialFolder.success).toBeTruthy();
  });
});

describe('Testing commands with invalid parameters', () => {
  test(`Validate method removes spaces`, () => {
    const answer = 'CREATE parameter '
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeTruthy();
  });

  test(`LIST command works without any other parameter`, () => {
    const answer = 'LIST parameter'
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('Only LIST command');
  });
  
  test(`CREATE works with only 1 parameter`, () => {
    const answer = 'CREATE parameter parameter'
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('Needs only 1 folder_name');
  });

  test(`MOVE works with 2 parameters`, () => {
    const answer = 'MOVE parameter ';
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('Needs both folder_to_move and parent_folder');
  });

  test(`DELETE works with only 1 parameter`, () => {
    const answer = 'DELETE parameter parameter'
    const response = utilsService.validateAnswer(answer);

    expect(response.success).toBeFalsy();
    expect(response.message).toBe('Needs only 1 folder_name');
  });
});

describe('Testing commands with valid parameters', () => {
  const initFolder = utilsService.initFolder();
  const initialFolder = initFolder.message;
  
  test(`CREATE command should create a new folder`, () => {
    const answer = 'CREATE parameter'
    const valid = utilsService.validateAnswer(answer);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const folder = path.join(initialFolder.split('\\').join('/'), 'parameter');
    const created = fs.existsSync(folder);
    
    expect(created).toBeTruthy();
    expect(response.success).toBeTruthy();
  });

  test(`DELETE command should delete a folder`, () => {
    const createMessage = 'CREATE parameter';
    let valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    const deleteMessage = 'DELETE parameter';
    valid = utilsService.validateAnswer(deleteMessage);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const folder = path.join(initialFolder.split('\\').join('/'), 'parameter');
    const deleted = !fs.existsSync(folder);
    
    expect(deleted).toBeTruthy();
    expect(response.success).toBeTruthy();
  });

  /* test(`DELETE command should delete a folder`, () => {
    const createMessage = 'CREATE parameter';
    let valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    const deleteMessage = 'DELETE parameter';
    valid = utilsService.validateAnswer(deleteMessage);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const folder = path.join(initialFolder.split('\\').join('/'), 'parameter');
    const deleted = !fs.existsSync(folder);
    
    expect(deleted).toBeTruthy();
    expect(response.success).toBeTruthy();
  }); */

  test(`LIST command should list the complete directory tree`, () => {
    let createMessage = 'CREATE parent';
    let valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    createMessage = 'CREATE parent/child';
    valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    createMessage = 'CREATE child';
    valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    const listMessage = 'LIST';
    valid = utilsService.validateAnswer(listMessage);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const folderParent = path.join(initialFolder.split('\\').join('/'), 'parent');
    const exists = fs.existsSync(folderParent);
    
    expect(exists).toBeTruthy();
    expect(response.message).toBe('Directory Tree\n\tchild\n\tparent\n\t\tchild');
    expect(response.success).toBeTruthy();
  });

});
