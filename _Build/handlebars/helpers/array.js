module.exports = function (value, option) {
  var arr = "[";

  for(var key in value){
  	arr += "\"" + value[key] + "\", ";
  }

  arr += "]";

  return arr;
};