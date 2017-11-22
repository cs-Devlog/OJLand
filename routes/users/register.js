var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;

var users;
router.get('/', function(req, res, next) {
    var queryStr = 'SELECT * FROM user';
    pool.getConnection(function(err, connection) {
        connection.query(queryStr, function(err, rows) {
            if(err) console.log("err: ", err);
            users = rows;
            res.render('register');
            connection.release();
        });
    });
});

router.post('/', function(req, res, next) {
  var body = req.body;
  var queryStr = 'INSERT INTO user(_UID, Email, Password, Name, Birth, Tel, UserType) '
                + 'VALUES(?,?,?,?,?,?,?);';

  var newID = Number(users[users.length-1]._UID) + 1;
  var inputs = [newID, body.Email, body.Password, body.Name, body.Birth, body.Tel, body.UserType];
  for(var i = 0; i < users.length; i++) {
      if (body.Email == users[i].Email) {
          // res.send('<script>alert("이미 존재하는 이메일 입니다!");</script>');
          res.redirect('/register');
      }
  }
  pool.getConnection(function(err, connection) {
      connection.query(queryStr, inputs, function(err, rows) {
          if(err) console.log("err: ", err);
          res.redirect('/register/success');
          connection.release();
      });
  });
});

router.get('/success', function(req, res, next) {
    res.render('register-success');
});

module.exports = router;