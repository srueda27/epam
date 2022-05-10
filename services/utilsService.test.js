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
  test(`CREATE command should create a new folder`, () => {
    const initFolder = utilsService.initFolder();
    const initialFolder = initFolder.folder;

    const answer = 'CREATE folder';
    const valid = utilsService.validateAnswer(answer);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const list = initialFolder.toList();
    expect(list).toBe(`main_folder\n\tfolder`);
    expect(response.message).toBe('New folder created: folder');
  });

  test(`DELETE command should delete a folder`, () => {
    const initFolder = utilsService.initFolder();
    const initialFolder = initFolder.folder;

    const createMessage = 'CREATE parameter';
    let valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    const deleteMessage = 'DELETE parameter';
    valid = utilsService.validateAnswer(deleteMessage);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    const list = initialFolder.toList();
    expect(list).toBe(`main_folder`);

    expect(response.success).toBeTruthy();
    expect(response.message).toBe('Folder deleted succesfully: parameter');
  });

  test(`LIST command should list the complete directory tree`, () => {
    const initFolder = utilsService.initFolder();
    const initialFolder = initFolder.folder;

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

    expect(response.message).toBe('main_folder\n\tparent\n\t\tchild\n\tchild');
  });

  test(`MOVE command should move first folder into the second one`, () => {
    const initFolder = utilsService.initFolder();
    const initialFolder = initFolder.folder;

    let createMessage = 'CREATE parent_folder';
    let valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    createMessage = 'CREATE moving_child';
    valid = utilsService.validateAnswer(createMessage);
    utilsService.proccessCommands(initialFolder, valid.message);

    const moveMessage = 'MOVE moving_child parent_folder';
    valid = utilsService.validateAnswer(moveMessage);
    const moved = utilsService.proccessCommands(initialFolder, valid.message);

    const listMessage = 'LIST';
    valid = utilsService.validateAnswer(listMessage);
    const response = utilsService.proccessCommands(initialFolder, valid.message);

    expect(moved.success).toBeTruthy();
    expect(response.message).toBe('main_folder\n\tparent_folder\n\t\tmoving_child');
  });

});
