'use strict';

class Directory {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.folders = [];
  }

  isDirectory() {
    return this.type === 'folder' ? true : false;
  }

  toList(depth = 0) {
    if (this.folders.length == 0) {
      return `${'\t'.repeat(depth)}` + this.name;
    }

    let string = `${'\t'.repeat(depth)}` + this.name;
    const newDepth = depth + 1;

    for (let i = 0; i < this.folders.length; i++) {
      const folder = this.folders[i];

      string += '\n' + folder.toList(newDepth);
    }

    return string;
  }

  deleteFolder(deleteIdx) {
    this.folders.splice(deleteIdx, 1);
    return this;
  }
}

module.exports = {
  Directory
}