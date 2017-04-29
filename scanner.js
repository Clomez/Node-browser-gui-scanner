module.exports = PortScan;


				var mysql = require('mysql');
				var obj = {};
				var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
				  password : '38613861',
				  database : 'ipRes'
				});

var portscanner = require('portscanner');
var fs = require("fs");

function PortScan(ip, range, nameR, range2, owner){

	portscanner.findAPortInUse(range, ip, function(error, port) {
	 
		//WRITE FILE
		fs.writeFile("Public/scan/" + ip, 
"<!DOCTYPE html>"+
"<head>" +
"<title>Resault of: " + nameR + "</title>" +
"</head>" +
"<body> " +
"<h1>Resaults of: " + ip + "</h1><br>" +
"<p> Target IP was: " + ip + " -- on range of " + range2 + " </p>" +
"<p> Port in use at: " + port + "</p><br>" +
'<a href="/#etusivu" class="ui-btn ui-icon-info ui-btn-icon-left ui-btn-inline ui-corner-all"" >Back</a> ', function(err) {
		    if(err) {
			return console.log(err);
		    }

		

		


				if (err) throw err
			

			    connection.query('INSERT INTO ipRes (ip, link, owner) VALUES (?, ?, ?)', [ip, nameR, owner], function(err, result) {
			      if (err) throw err
			
			   
			  }) 
			

		
		}); 


	return 0;
	});

}
