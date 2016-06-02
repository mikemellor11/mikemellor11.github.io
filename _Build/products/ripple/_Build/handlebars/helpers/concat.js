module.exports = function (json) {
  var concat = '';
  var flipArray = [];
  for(var key in json.hash){
    flipArray.push(json.hash[key]);
  }

  for(var i = (flipArray.length - 1); i >= 0; i--){
    concat += flipArray[i];
  }

  return concat;
};