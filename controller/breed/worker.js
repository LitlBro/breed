var clone = require('clone');
const Bc = 'Breed_C';
const Bnc = 'Breed_NC';

function breed(set, factor) {
  var initBreed = set.breed;
  var rand = Math.random() * 3;
  var Affinity = 0;
  var hasSwitched = false;
  var evolution = {};
  for(var i = 1; i <= 15; i++) {
    set.age = set.age + 1;
    if (set.renew==false) {
        affinity = set.payment/set.price + (rand * set.promotion * set.inertia);
        if (set.breed == Bc && affinity < (set.grade * set.brand)) {
          set.breed = Bnc;
          hasSwitched = true;
        } else if (set.breed == Bnc && affinity < (set.grade * set.brand * factor)) {
          set.breed = Bc;
          hasSwitched = true;
        }
    }
    evolution[i] = {
      prev: clone(initBreed),
      curr: clone(set.breed),
      modified: clone(hasSwitched)
     };
    rand = Math.random() * 3;
  }
  return evolution;
}

function compute(rows) {
  var breedC = 0;
  var breedNc = 0;
  var bcLost = 0;
  var bcGained = 0;
  var bcRegained = 0;
  for(index in rows) {
    var curr = rows[index].curr;
    var init = rows[index].prev;
    var switched = rows[index].modified;

      // count breedC and breedNC
      if(curr == Bc) breedC ++;
      else breedNc ++;

      // count bcLost and bcGained
      if(curr != init) {
        if( curr == Bc) bcGained ++;
        else bcLost ++;
      } else {
      // count regained : from INITIAL breed type (0 if initial breed_nc)
        if(switched && curr == Bc) bcRegained ++;
      }
  }
  return {
    'breed_C':breedC,
    'breed_NC':breedNc,
    'breed_C_Lost':bcLost,
    'breed_C_Gained':bcGained,
    'breed_C_Regained':bcRegained
  }
}

  let body = '';
process.stdin.on('data', function(data) {
  body+=data;
});

process.stdin.on('end', function(data) {
  var tmp = JSON.parse(body);
  var rows = tmp.rows;
  var factor = tmp.factor;
  var yearsIndex = {};
  var index = 0;
  for(index in rows) {
    var tmp = breed(rows[index],factor);

    for(index in tmp) {
      if(yearsIndex[index] == undefined) yearsIndex[index] = [clone(tmp[index])];
      else yearsIndex[index].push(clone(tmp[index]));
    }

  }

  var result = {};
  for(index in yearsIndex) {
    result[index] = compute(yearsIndex[index]);
  }

  process.stdout.write(JSON.stringify(result));

});
