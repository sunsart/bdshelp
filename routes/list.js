//라우터 객체
let router = require('express').Router();

//nodejs 와 mysql 접속
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//-----------------------------------------//

//메인 페이지
router.get('/', function(req, res) {
  res.render('index.ejs');
})

//특약사항 페이지
router.get('/clause', function(req, res){
  let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
  let params = "apt_trade";
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('clause.ejs', {data:rows});
  })
});

//특약사항 페이지, 시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
router.get('/type/:id', function(req, res) {
  let clauseType = req.params.id;
  let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
  let params = [clauseType];
  conn.query(sql, params, function(err, rows){
    if(err) throw err;
    res.render('clause.ejs', {data:rows});
  })
}) 

//router 변수를 외부 노출
module.exports = router;