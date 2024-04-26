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
  let sql = " SELECT id, title, region, area, cost, etc, user_id, user_name, hit, created_at \
              FROM find \
              ORDER BY id DESC";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    res.render('find_list.ejs', {data:rows, user:req.session.user});
  })
})

//매물찾아요 검색 리스트 페이지
router.get('/find_search', function(req, res) {
  let query = "%" + req.query.search +"%";
  let sql = " SELECT id, title, region, area, cost, etc, user_id, user_name, hit, created_at \
              FROM find \
              WHERE title LIKE ? OR etc LIKE ? \
              ORDER BY id DESC";
  let params = [query, query];  
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('find_list.ejs', {data:rows, user:req.session.user});
  })
})


//매물찾아요 게시물등록 페이지
router.get('/find_write', function(req, res) {
  res.render('find_write.ejs', {user:req.session.user});
})


//매물찾아요 게시물 내용보기 페이지
router.get('/find_detail/:id', async function(req, res) {
  // 쿠키에 저장되어있는 값이 있는지 확인 (없을시 undefined 반환)
  let keyVal = "f_" + req.params.id;
  if (req.cookies[keyVal] == undefined) {
    // key, value, 옵션을 설정해준다.
    res.cookie(keyVal, getUserIP(req), {
      // 유효시간 : 1분  **테스트용 1분 / 출시용 1시간 3600000  
      maxAge: 60000
    })
    // 쿠키에 저장값이 없으면 조회수 1 증가
    let sql = "UPDATE find SET hit=find.hit+1 WHERE id=?";
    let params = [req.params.id];
    conn.query(sql, params, function(err, result) {
      if(err) throw err;
    })
  }
  //쿠키에 저장값이 있으면 조회수 증가하지 않고, 내용을 보여줌
  let sql = " SELECT id, title, region, area, cost, tel, etc, user_id \
              FROM find \
              WHERE id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('find_detail.ejs', {data:rows, user:req.session.user});
  })
})


//매물찾아요 게시판 edit 양식 페이지
router.get('/find_edit/:id', function(req, res) {
  let sql = " SELECT id, title, region, area, cost, tel, etc \
              FROM find \
              WHERE id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('find_edit.ejs', {data:rows, user:req.session.user});
  })
})


//질문답변 update
router.post('/find_edit', function(req, res) {
  let find_id = req.body.find_id
  let title = req.body.title;
  let region = req.body.region;
  let area = req.body.area;
  let cost = req.body.cost;
  let tel = req.body.tel;
  let etc = req.body.etc;
  let post_date = postDate();

  let sql = "UPDATE find SET title=?, region=?, area=?, cost=?, tel=?, etc=?, created_at=? WHERE id=?";
  let params = [title, region, area, cost, tel, etc, post_date, find_id];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("매물찾아요수정성공");
  })
})


//게시물 삭제 라우터
router.post('/find_delete', function(req, res) {
  let find_id = req.body.find_id;
  let sql = "DELETE FROM find WHERE id = ?";
  conn.query(sql, find_id, function(err, result) {
    if(err) throw err;
    res.send("게시물삭제성공");
  })
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