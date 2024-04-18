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

//매물찾아요 리스트 페이지
router.get('/find_list', function(req, res) {
  let sql = " SELECT id, title, user_id, user_name, hit, created_at \
              FROM find \
              ORDER BY id DESC";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    res.render('find_list.ejs', {data:rows, user:req.session.user});
  })
})

//매물찾아요 게시물등록 페이지
router.get('/find_write', function(req, res) {
  res.render('find_write.ejs', {user:req.session.user});
})

//매물찾아요 게시물 쓰기 라우터
router.post('/find_post', function(req, res) {
  let title = req.body.title;
  let region = req.body.region;
  let area = req.body.area;
  let cost = req.body.cost;
  let tel = req.body.tel;
  let etc = req.body.etc;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;
  let post_date = postDate();

  let sql = " INSERT INTO find (title, region, area, cost, tel, etc, user_id, user_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let params = [title, region, area, cost, tel, etc, user_id, user_name, post_date];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("매물찾아요작성성공");
  })
})


//현재 날짜 가져오기
function postDate() {
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {year: 'numeric',});
  const month = today.toLocaleDateString('en-US', {month: '2-digit',});
  const day = today.toLocaleDateString('en-US', {day: '2-digit',});
  return `${year}-${month}-${day}`;
}

//client ip를 가져오는 함수
function getUserIP(req) {
  const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  return addr
}

//router 변수를 외부 노출
module.exports = router;