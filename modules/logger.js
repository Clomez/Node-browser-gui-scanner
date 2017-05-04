module.exports = logger;

var fs = require("fs");
var currentdate = new Date(); 

function logger (user, target, range, iphost){
//WRITE FILE
		fs.writeFile("Public/log/" + currentdate, 
currentdate + " " +
"AS a user: " + user + " " +
"target IP: " + target + " " +
"target range: " + range + " " +
"from ip: " + iphost + "\r\n " , function(err) {
		    if(err) {
			return console.log(err);
		    }

		})   

};
