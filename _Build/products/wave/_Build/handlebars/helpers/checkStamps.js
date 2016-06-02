var isType = require('./isType.js');

module.exports = function (stamp, player, json) {
    if(isType(stamp, 'string')){
        return json.data.root.content[player].slideStamps[(+stamp - 1)].time;
    }

    return stamp;
}