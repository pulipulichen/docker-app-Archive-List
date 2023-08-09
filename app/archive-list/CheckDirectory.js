const fs = require('fs');
const path = require('path');

function CheckDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);

    const validExtensions = ['.list.7z', '.list.xlsx'];
    let foundExtensions = [];

    for (const file of files) {
      const fileExtension = path.extname(file);
      if (validExtensions.includes(fileExtension)) {
        foundExtensions.push(fileExtension);
      }
    }

    if (foundExtensions.length === 2 && foundExtensions.includes('.list.7z') && foundExtensions.includes('.list.xlsx')) {
      console.log('Directory contains the required files.');
      return true
    } else {
      console.log('Directory does not contain the required files.');
      return false
    }
  } catch (error) {
    console.error('Error reading directory:', error);
    return false
  }
}

module.exports = CheckDirectory