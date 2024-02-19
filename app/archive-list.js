// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const CheckDirecotry = require('./archive-list/CheckDirectory')
const DirectoryToList = require('./archive-list/DirectoryToList')
const DirectoryTo7z = require('./archive-list/DirectoryTo7z')

const ArchiveToDirectory = require('./archive-list/ArchiveToDirectory')
const RemoveList = require('./archive-list/RemoveList')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

// -------------------------------------------------------------



// -------------------------------------------------------------


let main = async function () {
  
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let directoryPath = files[i]
    const stats = fs.statSync(directoryPath);
    if (stats.isDirectory(directoryPath) === false) {
      // directoryPath = path.dirname(directoryPath)
      continue
    }
    // return console.log(CheckDirecotry(directoryPath))
    if (CheckDirecotry(directoryPath) === false) {
      let listFilePath = await DirectoryToList(directoryPath)
      let archiveFilePath = await DirectoryTo7z(directoryPath)
      // console.log(listFilePath, archiveFilePath)

      fs.renameSync(directoryPath, directoryPath + '.bak')
      fs.mkdirSync(directoryPath)

      // fs.copyFileSync(listFilePath, path.join(directoryPath, path.basename(listFilePath)));
      fs.renameSync(listFilePath, path.join(directoryPath, path.basename(listFilePath)));
      fs.renameSync(archiveFilePath, path.join(directoryPath, path.basename(archiveFilePath)));

      fs.rmdirSync(directoryPath + '.bak', { recursive: true });

      let gdriveDir = path.join(path.dirname(directoryPath), 'gdrive')
      if (fs.existsSync(gdriveDir) === false) {
        fs.mkdirSync(gdriveDir)
      }

      let gdriveArchiveDir = path.join(gdriveDir, path.basename(directoryPath))
      if (fs.existsSync(gdriveArchiveDir) === false) {
        fs.mkdirSync(gdriveArchiveDir)
      }

      let gdriveArchiveFile = path.join(gdriveArchiveDir, path.basename(listFilePath))
      if (fs.existsSync(gdriveArchiveFile) === false) {
        console.log({listFilePath, gdriveArchiveFile})
        fs.copyFileSync(listFilePath, gdriveArchiveFile)
      }
    }
    else {
      // RemoveList(directoryPath)
      let tmpDirectory = await ArchiveToDirectory(directoryPath)
      if (!tmpDirectory) {
        console.error('tmp directory does not exist')
        continue
      }

      fs.rmdirSync(directoryPath, { recursive: true });
      fs.renameSync(tmpDirectory, directoryPath);
    }
  }
}

main()