const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

  switch (command) {
    case 'CREATE':
      return createFolder(initialFolder, commandArr[1]);
    case 'MOVE':
      return moveFolder(initialFolder, commandArr[1], commandArr[2]);
    case 'LIST':
      return listDirectory(initialFolder);
    case 'DELETE':
      return deleteFolder(initialFolder, commandArr[1]);
  }
}

function listDirectory(initialFolder) {
  const directory = getDirectories(initialFolder);
  const directoryText = printDirectory(directory);

  return { success: true, message: directoryText };
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
  const deleteFolderPath = path.join(initialFolder, pathName);

  try {
    fs.rmSync(deleteFolderPath, { recursive: true });

    return { success: true, message: 'Folder deleted succesfully' };
  } catch (error) {
    let invalidFolder = getInvalidFolder(initialFolder, pathName);

    return { success: false, message: `Cannot delete ${pathName} - ${invalidFolder} does not exist` };
  }
}

function createFolder(initialFolder, pathName) {
  const newFolderPath = path.join(initialFolder, pathName);

  try {
    const newFolder = fs.mkdirSync(newFolderPath, { recursive: true });

    if (newFolder) {
      return { success: true, message: `New folder created: ${pathName}` };
    }
  } catch (error) {
    return { success: false, message: 'Please do not insert special characters' };
  }
}

function getInvalidFolder(initialFolder, folderName) {
  if (!fs.existsSync(path.join(initialFolder, folderName))) {
    return folderName;
  }

  const invalidFolderArr = folderName.split('/');
  for (let i = 0; i < invalidFolderArr.length; i++) {
    const folder = invalidFolderArr.slice(0, i).join('/');
    const validateFolder = path.join(initialFolder, folder);

    if (!fs.existsSync(validateFolder)) {
      return folder;
    }
  }
}

function getDirectories(initialFolder) {
  const folders = fs.readdirSync(initialFolder, { withFileTypes: true });

  return folders.map(dirent => {
    if (dirent.isDirectory()) {

      const folderPath = path.join(initialFolder, dirent.name);

      const folder = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(item => item.name);

      const times = folderPath.split('\\').length - 5;
      const repeatText = `${'\t'.repeat(times)}`;

      if (folder.length == 0) {
        return repeatText + dirent.name
      }

      return `${repeatText}${dirent.name}\n` + getDirectories(folderPath);
    }
  });
}

function printDirectory(directory) {
  let text = 'Directory Tree';
  for (let i = 0; i < directory.length; i++) {
    text += '\n' + directory[i];
  }

  return text
}

function initFolder() {
  const folderName = path.join(__dirname.split('\\', 4).join('\\'), uuidv4());

  try {
    return { success: true, message: fs.mkdirSync(folderName, { recursive: true }) };
  } catch (error) {
    return { success: false, message: 'Unable to create folder' };
  }
}

module.exports = {
  validateAnswer,
  initFolder,
  proccessCommands
}
