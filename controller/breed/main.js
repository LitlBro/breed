const DbModel = require('../../model/handler/databaseHandler.js');
const Config = require('../../model/handler/configHandler.js');
var async = require('async');

const Bc = 'Breed_C';
const Bnc = 'Breed_NC';

function breed(set, factor) {
  var initBreed = set.breed;
  var rand = Math.random() * 3;
  var Affinity = 0;
  var hasSwitched = false;
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
    rand = Math.random() * 3;
  }
  return {set, initBreed, hasSwitched};
}

function compute(rows) {
  var breedC = 0;
  var breedNc = 0;
  var bcLost = 0;
  var bcGained = 0;
  var bcRegained = 0;
  for(index in rows) {
    var curr = rows[index].set;
    var init = rows[index].initBreed;
    var temp = rows[index].hasSwitched;

      // count breedC and breedNC
      if(curr.breed == Bc) breedC ++;
      else breedNc ++;

      // count bcLost and bcGained
      if(curr.breed != init) {
        if( curr.breed == Bc) bcGained ++;
        else bcLost ++;
      } else {
        // if same breed as before, but changed back to C
        if(temp && curr.breed == Bc) bcRegained ++;
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

async function execute(factor) {
  var path = Config.getRoot(Config.values) + Config.getDbLoc(Config.values) + Config.getDbName(Config.values);
  var db = await DbModel.open(path);
  var rows = await DbModel.get(db);
  DbModel.close(db);

  var fetch = [];
  for(index in rows) {
    fetch.push(breed(rows[index],factor));
  }
  var result = compute(fetch);
  return result;
}

module.exports.execute = execute;
