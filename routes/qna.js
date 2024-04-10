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

//질문답변 리스트
router.get('/qna', function(req, res) {
  let sql = "SELECT title, user_name, hit, created_at FROM qna";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    res.render('qna_list.ejs', {data:rows, user:req.session.user});
  })
})

//질문답변 게시물등록 페이지
router.get('/qna_write', function(req, res) {
  res.render('qna_write.ejs', {user:req.session.user});
})

router.post('/qna_post', function(req, res) {
  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;

  let sql = "INSERT INTO qna (title, content, user_id, user_name, created_at) VALUES (?, ?, ?, ?, curdate())";
  let params = [title, content, user_id, user_name];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("게시물작성성공");
  })
})

//router 변수를 외부 노출
module.exports = router;