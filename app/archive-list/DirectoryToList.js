
const mime = require('mime');
const ExcelJS = require('exceljs');

const path = require('path')
const fs = require('fs')


// Function to recursively traverse a directory and collect file information
function traverseDirectory(directoryPath, filesInfo, topDirectoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      traverseDirectory(filePath, filesInfo, topDirectoryPath);
    } else {
      let extname = ''
      let mimeType = ''
      let size = stats.size / (1024 * 1024).toFixed(2)
      if (stats.isDirectory() === false) {
        extname = path.extname(file);
        mimeType = mime.getType(file);
      }

      const fileInfo = {
        relativePath: path.relative(topDirectoryPath, filePath),
        filename: file,
        ext: extname,
        mimeType: mimeType, // You can use libraries like 'mime-types' to determine MIME type
        fileSizeMB: size,
        createTime: stats.birthtime,
        lastModifiedTime: stats.mtime,
      };
      filesInfo.push(fileInfo);
    }
  }
}



let DirectoryToList = async (directoryPath) => {
  let topDirectoryPath = directoryPath  

  const outputFilePath = directoryPath + '.list.ods';
  const filesInfo = [];
  traverseDirectory(directoryPath, filesInfo, topDirectoryPath);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('File Information');
  
  // Add headers
  worksheet.addRow([
    'Relative Path', 'Filename', 'Extension', 'MIME Type', 'File Size (MB)', 'Create Time', 'Last Modified Time'
  ]);
  
  // Add file information rows
  for (const fileInfo of filesInfo) {
    worksheet.addRow([
      fileInfo.relativePath,
      fileInfo.filename,
      fileInfo.ext,
      fileInfo.mimeType,
      fileInfo.fileSizeMB,
      fileInfo.createTime,
      fileInfo.lastModifiedTime
    ]);
  }
  
  // Save the workbook to the specified output file path
  await workbook.xlsx.writeFile(outputFilePath);

  return outputFilePath
}

module.exports = DirectoryToList