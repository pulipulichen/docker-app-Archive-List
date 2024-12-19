
const path = require('path')
const fs = require('fs')
const ShellSpawn = require('./../lib/ShellSpawn')

let DirectoryTo7z = async (folderPath) => {

  // Read all files and directories in the given path
  const items = fs.readdirSync(directoryPath);
  // Filter only `.xlsx` files
  const xlsxFiles = items.filter(item => {
      const itemPath = path.join(directoryPath, item);
      return fs.statSync(itemPath).isFile() && path.extname(item).toLowerCase() === '.xlsx';
  });
  if (xlsxFiles.length === 1) {
      return false
  }

  let noFiles = false
  while (true) {
    let list = fs.readdirSync(folderPath)
    if (list.length > 1) {
      break
    }
    else if (list.length === 1) {
      let nextPath = path.join(folderPath, list[0])
      if (fs.statSync(nextPath).isDirectory()) {
        folderPath = nextPath
        continue
      }
      else {
        break
      }
    }
    else {
      noFiles = true
      break
    }
  }

  if (noFiles) {
    return false
  }

  // ==================
  let filename = path.basename(folderPath)
  let dirname = path.dirname(folderPath)

  let outputFilePath = path.resolve(dirname, filename + '.list.7z')

  let cmd = `cd "${folderPath}"; 7z a -t7z "${outputFilePath}" -mx9 -aoa -ms=on -m0=lzma2 *`
  await ShellSpawn(cmd)

  return outputFilePath
}

module.exports = DirectoryTo7z