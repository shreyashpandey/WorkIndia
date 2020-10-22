var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'test' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});
app.post('/app/user', function (req, res) {
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO webusers (username,password) values(?,?)', [req.body.username,req.body.password], function (error, results, fields) {
       if (error) throw error;
       let finalresult={"status":"account created"};
       res.end(JSON.stringify(finalresult));
     });
 });
 app.post('/app/user/auth', function (req, res) {
    connection.query('select * from webusers where username=? and password=?', [req.body.username,req.body.password], function (error, results, fields) {
       if (error) throw error;
       let finalresult={"status":"success","usersId":"int"};
       res.end(JSON.stringify(results));
     });
 });
 app.get('/app/sites/list/', function (req, res) {
    connection.query('select webdata from authors where userid=?', [req.query.userid], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });
 app.post('/app/sites', function (req, res) {

    connection.query('UPDATE `webusers` SET `webdata`=?,`city`=? where `Id`=? and `webdata.website`=?', [req.query.userid,req.body.website], function (error, results, fields) {
       if (error) throw error;
       results.status="success";
       res.end(JSON.stringify(results));
     });
 });
//rest api to get all customers