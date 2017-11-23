var express = require('express');
var router = express.Router();
var pool = require('../../config.js').pool;
var moment = require('moment');

router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
      connection.query('SELECT * FROM user', function(err, users) {
          if(err) console.log("err: ", err);
          pool.getConnection(function(err, connection) {
              connection.query('SELECT * FROM orders', function(err, rows) {
                  if(err) console.log("err: ", err);
                  var dates = [];
                  for (var i = 0; i < rows.length; i++) {
                      dates[i] = moment(rows[i].Time).format('YYYY/MM/DD');
                  }
                  res.render('order-list', {
                      category: '전체',
                      data: rows,
                      reqNum: '0',
                      date: dates,
                      usertype: req.session.UserType,
                      name: req.session.Name
                  });
                  connection.release();
              });
          });
          connection.release();
      });
  });
});

module.exports = router;