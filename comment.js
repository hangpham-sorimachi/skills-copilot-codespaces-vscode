// create a server
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'test',
	port: 3306
});
connection.connect();
app.use(cookieParser());
app.use(session({
	secret: '12345',
	name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true,
}));
app.get('/comment.html', function (req, res) {
	res.sendFile( __dirname + "/" + "comment.html" );
})
app.get('/listUsers', function (req, res) {
	connection.query('SELECT * FROM comment', function(err, result) {
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log('--------------------------SELECT----------------------------');
		console.log(result);
		console.log('------------------------------------------------------------\n\n');
		res.end(JSON.stringify(result));
	});
})
app.post('/addComment', urlencodedParser, function (req, res) {
	var response = {
		"name":req.body.name,
		"comment":req.body.comment
	};
	connection.query('INSERT INTO comment(name, comment) VALUES(?,?)', [response.name, response.comment], function(err, result) {
		if(err){
			console.log('[INSERT ERROR] - ',err.message);
			return;
		}
		console.log('--------------------------INSERT----------------------------');
		console.log('INSERT ID:',result);
		console.log('------------------------------------------------------------\n\n');
	});
	res.end(JSON.stringify(response));
})
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})