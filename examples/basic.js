'use strict';

var RubberDuck = require('..');

var duck = new RubberDuck();

console.log(duck.exchange('So whats up duck?'));
// I don't know much about ducks, tell me more?
console.log(duck.exchange('Making an example for this project'));
// Have you tried to not that?
console.log(duck.exchange('Well it would be helpful for people if I actually did do that.'));
// Is there an alternative to project?
console.log(duck.exchange('Probably, I have not looked much for things like rubber duck.'));
// Have you tried to not be?
console.log(duck.exchange('This conversation is getting more existential than I would like.'));
// Is there an alternative to duck?
console.log(duck.exchange('Probably, I could always talk to Fred'));
// it should learn more about conversations?
console.log(duck.exchange('Yes, it definitely and obviously should'));
