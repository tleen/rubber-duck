'use strict';

var pos = require('pos');

module.exports = {
  ask : function(query, callback){
    console.log('lib asked:', query);
    
    return callback(null, 'oh, ' + query + ' tell me more...');
  }
}
