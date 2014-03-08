
/**
 * So I just read Douglas Crockford's "JavaScript: The Good Parts"
 * and I've been playing with several JavaScript strategies
 * and conventions, and for now I've settled on what follows:
 *
 * - `Sniper` is the one variable in the global scope.
 *
 *   All other global variables are made visible to the 
 *   application by becoming properties of the global `Sniper`.
 * 
 *   This gives us 1) a namespace to declare 'global' variables
 *   while avoiding potential name clashes and 2) a way to break
 *   code into multiple files.
 *
 * - Custom objects (i.e. GameEngine, Enemy, etc) are created
 *   using Crockford's functional approach, which allows for 
 *   inheritance as well as private member variables and functions.
 *
 *   Object constructors are prefixed with 'create' and are
 *   properties on `Sniper`. The last lines of the constructor 
 *   will create a new object literal, add the desired public 
 *   functions to it as properties, and return the object.
 *
 *   Example:
 *   
 *     Sniper.createGame = function() { 
 *       // Member variables (always private):
 *       var draw,
 *           update;
 *
 *       // Function declarations (private by default):
 *       draw = function() ...
 *       update = function() ...
 *
 *       // (Optional) Initialization done in immediate 
 *       // function application:
 *       (function() {
 *         ...
 *       })();
 *
 *       // Expose select functions as public methods:
 *       var game = {};
 *       game.draw = draw;
 *       game.update = update;
 *       return game;
 *
 * - Functions, when named, are always named by assignment. 
 *   There is some merit to doing it the other way (and both 
 *   ways at once), but I prefer to treat functions like other 
 *   first-class citizens, and I rather be consistent.
 *   
 * - The rest is more or less from Airbnb's popular JavaScript 
 *   Style Guide: https://github.com/airbnb/javascript
 *
 * I could be messing this all up, but live and learn.
 *
 * @author Kevin Avery (kevin@avery.io)
 */
var Sniper = {};
