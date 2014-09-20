'use strict';

/* global describe, it, should */
/* jshint expr: true */

var RubberDuck = require('..'),
pkg = require('../package.json'),
templates = require('../templates.json'),
transcript = require('./transcript.json');

describe('.version', function(){
  it('should have same version as package', function(){
    (new RubberDuck()).version.should.equal(pkg.version);
  });
});

describe('initial exchange', function(){
  var rd = new RubberDuck();
  it('should ask an initial exchange question', function(){
    var response = rd.exchange('hello there');
    response.should.be.a.String;
    templates.initial.should.containEql(response);
  });

  it('should ask another initial exchange question', function(){
    var response = rd.exchange('Good, how are you?');
    response.should.be.a.String;
    templates.initial.should.containEql(response);
  });
});

describe('intermediate exchange', function(){
  var rd = new RubberDuck();

  transcript.intermediate.forEach(function(line){ rd.exchange(line); });
  
  it('should move into intermediate discussion', function(){
    var response = rd.exchange('Intermediate phase yet?');
    templates.initial.should.not.containEql(response);
  });
});

describe('advanced exchange', function(){
  var rd = new RubberDuck();

  transcript.advanced.forEach(function(line){ rd.exchange(line); });
  // xx - how to really test for this?
  it('should move into advanced discussion', function(){
    var response = rd.exchange('Advanced phase yet?');
    templates.initial.should.not.containEql(response);
  });
});
