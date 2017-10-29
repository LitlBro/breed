const sqlite3 = require('sqlite3').verbose();
const brandFactor = 2;

// open database in memory
let db = new sqlite3.Database('./breedDb', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

var start = new Date();

console.log("getting to promise");
run(db)
.then((data) => {
  var delay = new Date() - start;
  console.log(delay);
}).catch((err) => {
  console.log(err)
});



// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});

function breed(set, factor) {
  var initBreed = set.breed;
  var rand = Math.random() * 3;
  var Affinity = 0;
  for(var i = 1; i <= 15; i++) {
//    console.log(i);
    if (set.renew==false) {
        affinity = set.payment/set.price + (rand * set.promotion * set.inertia);
        if (set.breed == 'Breed_C' && affinity < (set.grade * set.brand)) {
          set.breed = 'Breed_NC';
        } else if (set.breed == 'Breed_NC' && affinity < (set.grade * set.brand * factor)) {
          set.breed = 'Breed_C';
        }
    }
    rand = Math.random() * 3;
  }
}


function run(database) {
  var count = 0;
  console.log("entering db");
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      database.each(`SELECT * FROM data`, (err, row) => {
        if (err) {
          reject(err);
        }
        count ++;
        breed(row, brandFactor);
      }, (data) => {
        console.log("solving promises count = " + count);
        console.log(data);
        resolve();
      });
    });

    })
}
