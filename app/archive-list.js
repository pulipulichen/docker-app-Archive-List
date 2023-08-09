// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const mime = require('mime');
const excel = require('excel4node');

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let main = async function () {
  
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let directoryPath = files[i]
    
    const outputFilePath = directoryPath + '.xlsx';

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

        worksheet.cell(row, 1).string(path.relative(directoryPath, filePath));
        worksheet.cell(row, 2).string(file);
        worksheet.cell(row, 3).string(path.extname(file));
        worksheet.cell(row, 4).string(mime.getType(file));
        worksheet.cell(row, 5).number(stats.size / (1024 * 1024)); // Convert to MB
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
  }
}

main()