var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var PortScan = require("./modules/scanner");
var logger = require("./modules/logger");
const testFolder = './Public/scan';
var lookup = require("./modules/dnslookup");
var fs = require("fs");
const passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var util = require('util');
var parser = require('parse-whois');
var whois = require('node-whois');
require('./modules/passport.js')(passport);

app.use(bodyParser());  // BodyParser
app.use(cookieParser()); // read cookies (needed for auth)
app.set('view engine', 'ejs'); // Use view engine ejs
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// required for passport
app.use(session({
	secret: 'somethingsomething',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(express.static(__dirname + '/Public'))

	//RETURN INDEX IF LOGGED
	app.get('/', isLoggedIn, function(req, res){

	var ip =getClientIP(req);
	res.render("index", { username: req.user.username });
	});



	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });




	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

	// =====================================
	// WHOIS ==============================
	// =====================================
	//Whois for url
	app.post('/whois', function(req, res, next) {
		var whoGet = req.body.whois;

		    whois.lookup(whoGet, function(err, data){
				if (err) throw err;
			    
				var info = parser.parseWhoIsData(data);
				//console.log(info);
				res.render("whois", {info: JSON.stringify(info) });
			    
			});
		
	});


	// =====================================
	// IPLOGGER ==============================
	// =====================================
	// Run scanner


	app.post('/iploggin', function(req, res){

	//NAME
	 	var nameR = req.body.nameR;
	//IP & RANGE
		var code = req.body.name2;
		var range = req.body.range;
	//ARRAY FROM RANGE
		var range2 = range.split("-");
		var list = [];
		for(i = range2[0]; i<= range2[1]; i++){
		list.push(i);
		}
	
	//OPTIONS
		var radioa = req.body.radio1;
		var radiob = req.body.radio2;
		var radioc = req.body.radio3;
		var set = PortScan(code, list, nameR, range, req.user.username);
		var iphost = getClientIP(req);
		var logg = logger(req.user.username, code, range, iphost);


	res.render("index", { username: req.user.username });

});

	// =====================================
	// DNSLOOKUP ==============================
	// =====================================
	// Dnslookup module


	app.get('/lookup', function (req, res, next) {
	    lookup("www.google.me", function (err, result) {
		if (err)  return console.error(err); 
		console.log(result);
		res.render("layout_lookup", { lookup: result });

	    });
	});

	// =====================================
	// REPORTS ==============================
	// =====================================
	//Bring back scan reports with id from MySQL
	//and loop them

	app.get('/Public/scan/*', function(req, res){

	res.sendFile(__dirname + req.url);



	});


	//DB//
	app.get('/data', isLoggedIn, function (req, res) {
	var mysql = require('mysql');
	var obj = {};
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '38613861',
	  database : 'ipRes'
	});



	connection.connect()

		//if admin
		if(req.user.username == "admin"){

			connection.query("SELECT * FROM ipRes", function (err, result) {


			if(err){
			    throw err;
			} else {
			    obj = {print: result};
			    res.render('report', obj);                
			}

		//not admin
		}); } else{
		connection.query("SELECT * FROM ipRes where owner = ?", [req.user.username],  function (err, result) {


				if(err){
				    throw err;
				} else {
				    obj = {print: result};
				    res.render('layout', obj);                
				}
			
			});
		}
		

});

	// =====================================
	// IS LOGGED IN CHECK ====================
	// =====================================
	//Check if logged in


	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}

	// =====================================
	// Get client ip   ====================
	// =====================================
	// get client

function getClientIP(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

app.listen(8080);
