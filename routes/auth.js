//라우터 객체
let router = require('express').Router();

//nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//비밀번호 암호화
const sha = require('sha256');

//-----------------------------------------//

//회원가입 라우터
router.post('/signup', async function(req, res, next) {
  let id = req.body.id;
  let pw = sha(req.body.pw);
  let email = req.body.email;
  let sql = "SELECT name FROM account WHERE name=?";
  conn.query(sql, [id], function(err, rows) {
    if (rows.length == 0) { //아이디 중복 없음
      let sql = "INSERT INTO account (name, pw, email, date) VALUES (?, ?, ?, curdate())";
      let params = [id, pw, email];
      conn.query(sql, params, function(err, result) {
        if(err) {
          throw err;
        } else {
          let bags = [];
          bags[0] = "가입성공";
          bags[1] = result.insertId;
          res.send(bags);
        }
      })
    } 
    else {
      res.send("아이디중복");
    }
  })
});


//로그인 라우터
router.post('/login', function(req, res){
  let username = req.body.name;
  let userpw = sha(req.body.pw);
  const sql = "SELECT * FROM account WHERE name = ? AND pw = ?";
  conn.query(sql, [username, userpw], function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      req.session.user = req.body;
      req.session.user.id = result[0].id;     //회원 고유 id 번호
      req.session.user.name = result[0].name; //회원 아이디
      req.session.save(function() {
        res.send("로그인성공"); 
      })
    } else {
      res.send("로그인실패");    
    }
  })
});

//로그아웃 라우터
router.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  })
})

//아이디 찾기 라우터
router.post('/findid', function(req, res){
  let email = req.body.email;
  const sql = "SELECT * FROM account WHERE email = ?";
  conn.query(sql, [email], function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      res.send(result[0].name);
    } else {
      res.send("아이디찾기실패");
    }
  })
});

//router 변수를 외부 노출
module.exports = router;