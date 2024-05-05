//라우터 객체
let router = require('express').Router();

// //nodejs 와 mysql 접속
// var mysql = require('mysql');
// var conn = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASS,
//   database: process.env.DATABASE
// });
// conn.connect();

//-----------------------------------------//


//
router.get('/calendar', function(req, res) {
  res.render('calendar.ejs', {user:req.session.user});
})


//router 변수를 외부 노출
module.exports = router;

