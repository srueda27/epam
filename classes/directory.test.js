const { Directory } = require('../classes/directory');

describe('Basic Directory methods', () => {
  const testDirectory = {
    name: 'Test',
    type: 'folder',
    folders: []
  };

  test('Constructor works', () => {
    const newDirectory = new Directory('Test', 'folder');

    expect(newDirectory).toEqual(testDirectory);
  });

  test('isDirectory works', () => {
    const newDirectory = new Directory('Test', 'file');

    expect(newDirectory.isDirectory()).toBeFalsy();
  });

  test('deleteFolder works', () => {
    const newDirectory = new Directory('Test', 'folder');
    newDirectory.folders = [
      {
        name: 'child_folder',
        type: 'folder',
        folders: []
      }
    ];

    newDirectory.deleteFolder(0);

    expect(newDirectory).toEqual(testDirectory);
  });

  test('isDirectory works', () => {
    testDirectory.folders = [
      new Directory('child_folder', 'folder')
    ];

    const list = new Directory().toList.apply(testDirectory);

    expect(list).toBe('Test\n\tchild_folder');
  });
});