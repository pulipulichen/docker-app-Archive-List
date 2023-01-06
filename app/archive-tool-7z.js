const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let main = async function () {
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    
    let isCompress = true
    let filenameNoExt

    let cmd
    if (fs.lstatSync(file).isDirectory()) {
      cmd = `cd "${file}"; 7z a "${path.resolve(dirname, filename + '.7z')}" -mcu=on *`
    }
    else {
      let ext
      filenameNoExt = filename
      if (filenameNoExt.indexOf('.') > -1) {
        ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase()
        filenameNoExt = filenameNoExt.slice(0, filenameNoExt.lastIndexOf('.'))
      }

      if (ext === '7z') {
        cmd = `7z x "${file}" -o"${path.resolve(dirname, filenameNoExt)}" -cu=on`
        isCompress = false
      }
      else {
        cmd = `7z a -t7z "${path.resolve(dirname, filenameNoExt + '.7z')}" -mx9 -aoa -ms=on -m0=lzma2 -mmt=off -mcu=on "${file}"`
      }
    }

    await ShellExec(cmd)
    
    if (isCompress === false) {
      let targetFolder = path.resolve(dirname, filenameNoExt)
      while (true) {
        if (targetFolder) {
          let list = fs.readdirSync(targetFolder)
          if (list.length > 1) {
            break
          }
          else if (list.length === 1 && fs.lstatSync(path.resolve(targetFolder, list[0])).isDirectory()) {
            let folderPath = path.resolve(targetFolder, list[0])
            await ShellExec(`cd "${folderPath}"; mv * ../; cd ../; rm -rf "${list[0]}"`)
          }
          else {
            break
          }
        }
      } 
    }
  }
}

main()