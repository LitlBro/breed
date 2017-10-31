/*
* Project config handler
* a specific config file could be build for each project
* prevent the presence of hard written variables
*/
var fs = require("fs");
console.log();
const pathToConfig = __dirname + '/../../config.json';
  try {
    var fs = require("fs");
    var content = fs.readFileSync(pathToConfig);
    var jsonContent = JSON.parse(content);
  } catch (error) {
    console.log(error);
  }

function getValue(content, index) {
  try {
    return content[index];
  } catch (e) {
    console.log(e);
  }
}

function getFactor(content) {
  return getValue(content, 'brandFactor');
}

function getDbName(content) {
  return getValue(content, 'dbName');
}

function getDbLoc(content) {
  return getValue(content, 'dbLocalization');
}

function getMaxWorker(content) {
  return getValue(content, 'nbMaxWorker');
}



module.exports.values = jsonContent;
module.exports.getFactor = getFactor;
module.exports.getDbName = getDbName;
module.exports.getDbLoc = getDbLoc;
module.exports.getMaxWorker = getMaxWorker;
