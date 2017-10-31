
function subDivide(array, n) {
  var chunkSize = n;

  return new Promise((resolve, reject) => {
    try {
      var groups = array.map(function(item, index) {
        return index % chunkSize === 0 ? array.slice(index, index + chunkSize) : null;
      })
        .filter(function(item){
          return item;
      });
      resolve(groups);
    } catch (err) {
      reject(err);
    }
  });
}


module.exports.divide = subDivide;
