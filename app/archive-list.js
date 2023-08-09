// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const CheckDirecotry = require('./archive-list/CheckDirectory')
const DirectoryToList = require('./archive-list/DirectoryToList')
const DirectoryTo7z = require('./archive-list/DirectoryTo7z')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

// -------------------------------------------------------------



// -------------------------------------------------------------


let main = async function () {
  
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let directoryPath = files[i]
    const stats = fs.statSync(filePath);
    if (stats.isDirectory(directoryPath) === false) {
      directoryPath = path.dirname(directoryPath)
    }

    if (CheckDirecotry(directoryPath) === false) {
      let listFilePath = DirectoryToList(directoryPath)
      let archiveFilePath = DirectoryTo7z(directoryPath)
      console.log(listFilePath, archiveFilePath)
    }
  }
}

main()