const sqlite3 = require('sqlite3').verbose();
var async = require('async');

// open database in memory
function open(path) {
  return new Promise((resolve, reject) => {
    var db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err);
      }
    });
    resolve(db);
  });
}

// close the database connection
function close(db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}


// mock function for the project
// an ORM is to be preferred forfurther development
function get(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT * FROM data`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
  })
}
// use example :
async function x() {
  var path = config.getRoot(config.values) + config.getDbLoc(config.values) + config.getDbName(config.values);
  console.log(path);
  var db = await open(path);
  var store = await get(db);
  console.log(store);
  close(db);
}

module.exports.get = get;
module.exports.open = open;
module.exports.close = close;
