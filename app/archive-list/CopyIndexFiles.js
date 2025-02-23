const fs = require('fs');
const path = require('path');

const ListFiles = require('../lib/ListFiles')

const isIndexFile = function (file) {
  console.log(file)
  return file.endsWith('.note.xlsx') || 
    file.endsWith('.note.docx') ||
    file.startsWith('cluster-windows')
}

const CopyIndexFiles = function (directoryPath, ENABLE_GDRIVE = false) {
    let fileList = ListFiles(path.join(directoryPath + ".bak"))

    for (let file of fileList) {
      if (isIndexFile(file)) {
        // console.log(noteFilePath, fs.existsSync(noteFilePath))
        if (fs.existsSync(file)) {
          if (ENABLE_GDRIVE) {
            fs.copyFileSync(file, path.join(gdriveArchiveDir, path.basename(file)))
          }
          fs.renameSync(file, path.join(directoryPath, path.basename(file)))
        }
      }
    }
}

module.exports = CopyIndexFiles