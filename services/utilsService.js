const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const validCommands = ['CREATE', 'MOVE', 'LIST', 'DELETE'];

function validate(answer) {
  const arr = answer.split(' ');

  if (arr.length > 3) {
    return false
  }

  if (validCommands.indexOf(arr[0]) == -1) {
    return false
  }

  switch (arr[0]) {
    case 'CREATE':
    case 'DELETE':
      if (arr.length != 2) {
        return false
      } else {
        return arr;
      }
    case 'MOVE':
      if (arr.length != 3) {
        return false
      } else {
        return arr;
      }
    case 'LIST':
      if (arr.length != 1) {
        return false
      } else {
        return arr;
      }
    default:
      return false;
  }
}

function proccessCommands(initialFolder, arr) {
  const command = arr[0];

  switch (command) {
    case 'CREATE':
      const folderPath = path.join(initialFolder, arr[1]);
      const newFolder = fs.mkdirSync(folderPath, { recursive: true });

      if (newFolder) {
        return arr[1];
      } 

      break;
    case 'MOVE':
      break;
    case 'LIST':
      const directory = getDirectories(initialFolder);
      const directoryText = printDirectory(directory);

      return directoryText;
    case 'DELETE':
      break;
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
  return fs.mkdirSync(folderName, { recursive: true });
}

module.exports = {
  validate,
  initFolder,
  proccessCommands
}
