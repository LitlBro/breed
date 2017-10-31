const DbModel = require('../../model/handler/databaseHandler.js');
const Config = require('../../model/handler/configHandler.js');
const UtilArray = require('../../model/utilities/array.js');
const { spawn } = require('child_process');

var async = require('async');



async function distribute(rows, factor) {
  var nbWorker = Config.getMaxWorker(Config.values);
  var nbChunk = Math.floor((rows.length)/nbWorker) + 1;
  var chunks = await UtilArray.divide(rows, nbChunk);

  var result = null;
  return new Promise((resolve, reject) => {
    try {
      for(index in chunks) {
        const worker = spawn('node', ['controller/breed/worker.js']);

        worker.stdout.on('data', (data) => {
          let body = JSON.parse(`${data}`);
          if(!result) result = body;
          else {
            for (index in body) {
              for(el in body[index]) {
                result[index][el] += body[index][el];
              }
            }
          }
        });
        worker.stderr.on('data', (data) => {
          reject(err);
        })
        worker.on('close', (code) => {
          nbWorker --;
          if(nbWorker == 0) {
            resolve(result);
          }
        });
        var payload = {
          'rows': chunks[index],
          'factor': factor
        };
        worker.stdin.write(JSON.stringify(payload));
        worker.stdin.end();
      }
    } catch(err) {
      reject(err);
    }
  });

}

async function execute(factor) {
  var path = Config.getRoot(Config.values) + Config.getDbLoc(Config.values) + Config.getDbName(Config.values);
  var db = await DbModel.open(path);
  var rows = await DbModel.get(db);
  var result = await distribute(rows, factor);
  console.log(result);
  return result;
}

module.exports.execute = execute;
