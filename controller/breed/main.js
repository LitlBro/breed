const DbModel = require('../../model/handler/databaseHandler.js');
const Config = require('../../model/handler/configHandler.js');
const UtilArray = require('../../model/utilities/array.js');
const { spawn } = require('child_process');

var async = require('async');


/*
* return a promises of computed results
* split the workload onto different worker (child process)
* stream data to the worker in a non-blocking way
* wait for all process to end before sending the final result
*/
async function distribute(payload, opt) {
  // split the workload in chunks for each slave
  var nbWorker = Config.getMaxWorker(Config.values);
  var nbChunk = Math.floor((payload.length)/nbWorker) + 1;
  var chunks = await UtilArray.divide(payload, nbChunk);

  var result = null;
  return new Promise((resolve, reject) => {
    try {
      for(index in chunks) {
        const worker = spawn('node', ['controller/breed/worker.js']);

        //on receiving data : add them to the final result
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
        //on error, reject promise
        worker.stderr.on('data', (data) => {
          reject(err);
        })
        //when child end computing : decrease counter
        //if counter reach 0, all slaves are done
        worker.on('close', (code) => {
          nbWorker --;
          if(nbWorker == 0) {
            resolve(result);
          }
        });
        var payload = {
          'rows': chunks[index],
          'factor': opt
        };
        worker.stdin.write(JSON.stringify(payload));
        worker.stdin.end();
      }
    } catch(err) {
      reject(err);
    }
  });

}

/*
* Abstraction of the program entire execution
*/
async function execute(factor) {
  var path = Config.getDbLoc(Config.values) + Config.getDbName(Config.values);
  var db = await DbModel.open(path);
  var rows = await DbModel.get(db);
  DbModel.close(db);
  var result = await distribute(rows, factor);
  return result;
}

module.exports.execute = execute;
