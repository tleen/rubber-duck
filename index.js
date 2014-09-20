'use strict';

var pos = require('pos'),
S = require('string'),
_ = require('lodash');

/*
* todo
* - Grunt + jshint
* - move initial gathering templates to external file
* - make module export instance
* - store all bucketed data for conversation
* - use bucketed data to created more detailed questions later
* - add tests
* - add to Travis
*/
var templates = {
  N : [
    'Ugh, {{word}}, may be worth looking at libraries that handle {{word}}.',
    'Tell me more about {{word}}, I\'m not unfamiliar.'
  ],
  V : [
    'What exactly are you trying to {{word}}',
    'I\'ve {{word}} before, is there a better way to do it?'
  ]
};



function arrayRandom(array){
  var index = _.random(0, array.length - 1);
  return array[index];
}

module.exports = {
  ask : function(query, callback){
    
    if(_.isEmpty(query)) return callback(new Error('Empty input'));

    var words = new pos.Lexer().lex(query);
    var taggedWords = new pos.Tagger().tag(words);

    var bucketed = _.chain(taggedWords).
      groupBy(function(a){ return a[1]; }).
      reduce(function(result, bucket, key){	
	result[key] = _.pluck(bucket,0);
	return result;
      }, {}).
      valueOf();


    // this is where things can evolve complicated, for now keep it simple
    // rebucked into nouns/verbs
    var rebucketed = _.reduce(bucketed, function(result, bucket, key){
      var index = key[0];
      if(_.has(result, index)) result[index] = _.merge(result[index], bucket);
      return result;
      }, {N : [], V : []});

    var order = ['N', 'V'];
    // 1/3rd of the time, switch key
    if(_.random(2) === 2) order.reverse();
    
    var message;

    order.forEach(function(key){
      if(message || (!rebucketed[key].length)) return;

      var template = arrayRandom(templates[key]);
      var word = arrayRandom(rebucketed[key]);
      message = S(template).template({word : word.toLowerCase()});      
    });


    if(_.isUndefined(message)) return callback(new Error('Unable to parse query'));
    return callback(null, message);
  }
};
