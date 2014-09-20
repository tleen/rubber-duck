'use strict';

var pkg = require('./package.json'),
natural = require('natural'),
PosAccumulator = require('pos-accumulator'),
S = require('string'),
_ = require('lodash');

/*
* todo
* - move initial gathering templates to external file
* - make module export instance
* - store all bucketed data for conversation
* - use bucketed data to created more detailed questions later
* - add to Travis
*/
var templates = require('./templates.json');

function arrayRandom(array){
  var index = _.random(0, array.length - 1);
  return array[index];
}

var nounInflector = new natural.NounInflector();

var transformers = {
  echo : function(str){ return str; },
  pluralize : function(str){ return nounInflector.pluralize(str); }
};


function RubberDuck(){
  this.exchangeCount = 0;
  this.accumulator = new PosAccumulator();

  this.handlers = {};

  this.handlers.empty = _.partial(arrayRandom, templates.empty);
  this.handlers.initial = _.partial(arrayRandom, templates.initial);

  var self = this;

  function substitution(templates){
    var t = arrayRandom(templates);
    var dictionary = {}; // retain any previous selections for a type

    // token {{pos[:transformation]}}
    return t.replace(/\{\{(.*?)\}\}/g, function(match){
      var directive = match.slice(2,-2).split(':'); // remove brackets
      var type = directive.shift();
      var transformer = directive.shift();
      if(!transformer) transformer = 'echo';
      // throw error if bad transformer?

      var replacement = 'that';
      if(dictionary[type]) replacement= dictionary[type]; 
      else{
	var replacements = self.accumulator.pos(type);
	
	if(replacements) replacement = arrayRandom(replacements).value;
	dictionary[type] = replacement;
      }
      replacement = transformers[transformer].call(null, replacement);

      return replacement;
    });
  }

  this.handlers.intermediate = _.partial(substitution, templates.intermediate);
  this.handlers.advanced = _.partial(substitution, templates.advanced);
}

RubberDuck.prototype.version = pkg.version;

RubberDuck.prototype.exchange = function(query){

  if(_.isEmpty(query)) return this.handlers.empty();

  this.exchangeCount++;
  var filtered = query.replace(/'/g, '');
  this.accumulator.put(filtered);

  var handler = this.handlers.initial;
  if(this.accumulator.entryCount('NN') !== 0) handler = this.handlers.intermediate;
  if(this.accumulator.entryCount() > 50) handler = this.handlers.advanced;
  
  return handler();
};

module.exports = RubberDuck;

