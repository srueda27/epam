const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Directory } = require('../classes/directory');

const validCommands = ['CREATE', 'MOVE', 'LIST', 'DELETE'];

function validateAnswer(answer) {
  const arr = answer.trim().split(' ');

  if (arr.length > 3) {
    return { success: false, message: 'More than 3 parameters' };
  }

  if (validCommands.indexOf(arr[0]) == -1) {
    return { success: false, message: 'Not a valid command' };
  }

  switch (arr[0]) {
    case 'CREATE':
    case 'DELETE':
      if (arr.length != 2) {
        return { success: false, message: 'Needs only 1 folder_name' };
      } else {
        return { success: true, message: arr };
      }
    case 'MOVE':
      if (arr.length != 3) {
        return { success: false, message: 'Needs both folder_to_move and parent_folder' };
      } else {
        return { success: true, message: arr };
      }
    case 'LIST':
      if (arr.length != 1) {
        return { success: false, message: 'Only LIST command' };
      } else {
        return { success: true, message: arr };
      }
  }
}

function proccessCommands(initialFolder, commandArr) {
  const rootDirectory = JSON.parse(JSON.stringify(initialFolder));
  const command = commandArr[0];
  let response;

  switch (command) {
    case 'CREATE':
      response = manageCreate(rootDirectory, commandArr[1]);
      return { mainFolder: response.mainFolder, operation: 'create', message: `New folder created: ${response.folderPath}` };
    case 'LIST':
      const list = new Directory().toList.apply(rootDirectory);
      return { mainFolder: rootDirectory, operation: 'list', message: list };
    case 'DELETE':
      response = deleteFolder(initialFolder, commandArr[1]);
      if (!response.success) {
        return { success: response.success, mainFolder: response.mainFolder, operation: 'delete', message: response.message };
      } else {
        return { success: response.success, mainFolder: response.mainFolder, operation: 'delete', message: `Folder deleted succesfully: ${response.folderPath}` };
      }
    case 'MOVE':
      return moveFolder(initialFolder, commandArr[1], commandArr[2]);
  }
}

function manageCreate(mainFolder, folderName) {
  const nameArr = folderName.split('/');

  let found;
  let newFolder;
  let folderPath;

  for (let i = 0; i < nameArr.length; i++) {
    const folder = nameArr[i];
    found = mainFolder.folders.findIndex(directory => directory.name == folder);

    if (found != -1) {
      newFolder = createFolders(nameArr.slice(i));
      mainFolder.folders[found] = newFolder;
      folderPath = nameArr.slice(i + 1).join('/');

      break;
    }
  }

  if (found == -1) {
    newFolder = createFolders(nameArr);
    mainFolder.folders.push(newFolder);
    folderPath = folderName;
  }

  return { mainFolder, folderPath };
}

function createFolders(nameArr) {
  if (nameArr.length == 1) {
    return new Directory(nameArr[0], "folder");
  }

  const rootDirectory = new Directory(nameArr[0], "folder");
  let parent;

  for (let i = 1; i < nameArr.length; i++) {
    const newFolder = new Directory(nameArr[i], "folder");

    if (!parent) {
      rootDirectory.folders.push(newFolder);
    } else {
      parent.folders.push(newFolder);
    }

    parent = newFolder;
  }

  return rootDirectory;
}

function moveFolder(initialFolder, oldFolderName, parentFolderName) {
  const oldPath = path.join(initialFolder, oldFolderName);
  const parentPath = path.join(initialFolder, parentFolderName);

  if (!fs.existsSync(oldPath)) {
    return { success: false, message: `No folder ${oldFolderName}` };
  }

  if (!fs.existsSync(parentPath)) {
    return { success: false, message: `No folder ${parentFolderName}` };
  }

  const newFolder = listDirectory(oldPath).message.replace('Directory Tree', '').replace(/(?:\t\n|\t|\n)/g, '/');

  let created;
  if (newFolder) {
    created = createFolder(parentPath, `${oldFolderName}/${newFolder}`);
  } else {
    created = createFolder(parentPath, oldFolderName.split('/').slice(-1).join('/'));
  }

  if (created.success) {
    const deleted = deleteFolder(initialFolder, oldFolderName);
    if (deleted.success) {
      return { success: true, message: 'Move successfully' };
    }
  }

  return { success: false, message: 'Move unsuccessfully' };
}

function deleteFolder(initialFolder, pathName) {
  const nameArr = pathName.split('/');

  if (initialFolder.folders.findIndex(folder => folder.name == nameArr[0]) == -1) {
    return { success: false, mainFolder: initialFolder, message: `Folder ${pathName} doesn't exists` };
  }

  if (nameArr.length == 1) {
    const deleteIdx = initialFolder.folders.findIndex(folder => folder.name == nameArr[0]);
    initialFolder.folders.splice(deleteIdx, 1);

    return { success: true, mainFolder: initialFolder, folderPath: pathName };
  }

  let nextFolder = initialFolder;
  let deleted = false;

  for (let i = 0; i < nameArr.length; i++) {
    const folderName = nameArr[i];
    const found = nextFolder.folders.findIndex(folder => folder.name == folderName);

    if ((i == nameArr.length - 1) && found != -1) {
      nextFolder.folders.splice(found, 1);
      deleted = true;
      break;
    }

    if (found != -1) {
      nextFolder = nextFolder.folders[found];
    }
  }

  if (deleted) {
    return { success: true, mainFolder: initialFolder, folderPath: pathName };
  } else {
    return { success: false, mainFolder: initialFolder, message: `Folder ${pathName} doesn't exists` };
  }
}

function initFolder() {
  const initialFolder = new Directory('main_folder', "folder");
  return { success: true, message: 'Initial folder created', folder: initialFolder };
}

module.exports = {
  validateAnswer,
  initFolder,
  proccessCommands
}
