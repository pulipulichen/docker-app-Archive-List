
const mime = require('mime');
const excel = require('excel4node');

const path = require('path')
const fs = require('fs')

let DirectoryToList = (directoryPath) => {
  let topDirectoryPath = directoryPath
    
  const outputFilePath = directoryPath + '.list.xlsx';

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Files');

  worksheet.cell(1, 1).string('Relative Path');
  worksheet.cell(1, 2).string('Filename');
  worksheet.cell(1, 3).string('Extension');
  worksheet.cell(1, 4).string('MIME Type');
  worksheet.cell(1, 5).string('File Size (MB)');
  worksheet.cell(1, 6).string('Create Time');
  worksheet.cell(1, 7).string('Last Modified Time');

  let row = 2;

  let processDirectory = (directoryPath) => {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      let extname = ''
      let mimeType = ''
      let size = stats.size / (1024 * 1024)
      if (stats.isDirectory() === false) {
        extname = path.extname(file);
        mimeType = mime.getType(file);
        // size = stats.size / (1024 * 1024)
      }

      worksheet.cell(row, 1).string('/' + path.relative(topDirectoryPath, filePath));
      worksheet.cell(row, 2).string(file);
      worksheet.cell(row, 3).string(extname);
      worksheet.cell(row, 4).string(mimeType);
      worksheet.cell(row, 5).number(size); // Convert to MB
      worksheet.cell(row, 6).date(stats.birthtime);
      worksheet.cell(row, 7).date(stats.mtime);

      row++;

      if (stats.isDirectory()) {
        processDirectory(filePath);
      }
    });
  }

  processDirectory(directoryPath);

  workbook.write(outputFilePath, err => {
    if (err) {
      console.error('Error writing the file:', err);
    } else {
      console.log('ODS file generated successfully.');
    }
  });

  return outputFilePath
}

module.exports = DirectoryToList