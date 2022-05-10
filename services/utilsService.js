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
  const command = commandArr[0];
  let response;

  switch (command) {
    case 'CREATE':
      response = manageCreate(initialFolder, commandArr[1]);
      return { operation: 'create', message: `New folder created: ${commandArr[1]}` };
    case 'LIST':
      const list = initialFolder.toList();
      return { operation: 'list', message: list };
    case 'DELETE':
      response = deleteFolder(initialFolder, commandArr[1]);
      if (!response.success) {
        return { success: response.success, operation: 'delete', message: response.message };
      } else {
        return { success: response.success, operation: 'delete', message: `Folder deleted succesfully: ${response.folderPath}` };
      }
    case 'MOVE':
      response = moveFolder(initialFolder, commandArr[1], commandArr[2]);
      if (!response.success) {
        return { success: response.success, operation: 'move', message: response.message };
      } else {
        return { success: response.success, operation: 'move', message: `Folder ${commandArr[1]} moved succesfully into ${commandArr[2]}` };
      }
  }
}

function moveFolder(initialFolder, oldFolderName, parentFolderName) {
  const oldFolder = findFolder(initialFolder, oldFolderName);
  if (!oldFolder) {
    return { success: false, message: `Folder ${oldFolderName} doesn't exists` };
  }

  const newFolder = findFolder(initialFolder, parentFolderName);
  if (!newFolder) {
    return { success: false, message: `Folder ${parentFolderName} doesn't exists` };
  }

  const response = deleteFolder(initialFolder, oldFolderName);

  if (response.success) {
    newFolder.folders.push(oldFolder);
    return { success: true }
  } else {
    return response
  }
}

function manageCreate(mainFolder, folderName) {
  const nameArr = folderName.split('/');

  let found;
  let newFolder;

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
  }
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

function deleteFolder(initialFolder, pathName) {
  const nameArr = pathName.split('/');

  if (initialFolder.folders.findIndex(folder => folder.name == nameArr[0]) == -1) {
    return { success: false, message: `Folder ${pathName} doesn't exists` };
  }

  if (nameArr.length == 1) {
    const deleteIdx = initialFolder.folders.findIndex(folder => folder.name == nameArr[0]);
    initialFolder.deleteFolder(deleteIdx);

    return { success: true, folderPath: pathName };
  }

  let nextFolder = initialFolder;
  let deleted = false;

  for (let i = 0; i < nameArr.length; i++) {
    const folderName = nameArr[i];
    const found = nextFolder.folders.findIndex(folder => folder.name == folderName);

    if ((i == nameArr.length - 1) && found != -1) {
      nextFolder.deleteFolder(found);
      deleted = true;
      break;
    }

    if (found != -1) {
      nextFolder = nextFolder.folders[found];
    }
  }

  if (deleted) {
    return { success: true, folderPath: pathName };
  } else {
    return { success: false, message: `Folder ${pathName} doesn't exists` };
  }
}

function findFolder(initialFolder, folderName) {
  const nameArr = folderName.split('/');
  let nextFolder = initialFolder;

  for (let i = 0; i < nameArr.length; i++) {
    const folderName = nameArr[i];
    const found = nextFolder.folders.findIndex(folder => folder.name == folderName);

    if ((i == nameArr.length - 1) && found != -1) {
      return nextFolder.folders[found];
    }

    if (found != -1) {
      nextFolder = nextFolder.folders[found];
    }
  }

  return;
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
