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

//질문답변 리스트 (스칼라 서브쿼리 성능문제로 차후 left join 방식으로 변경 필요)
router.get('/qna_list', function(req, res) {
  let sql = " SELECT id, title, user_name, hit, created_at, ( \
                SELECT count(*) \
                FROM comments AS c \
                WHERE c.qna_id = q.id) AS commentCount \
              FROM qna AS q \
              ORDER BY id DESC";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    res.render('qna_list.ejs', {data:rows, user:req.session.user});
  })
})

//질문답변 게시물등록 페이지
router.get('/qna_write', function(req, res) {
  res.render('qna_write.ejs', {user:req.session.user});
})


//질문답변 게시물내용 & 댓글 페이지
router.get('/qna_detail/:id', function(req, res) {
  let sql = " SELECT q.id, q.title, q.content, q.user_id, c.comment, c.user_name, c.created_at \
              FROM qna AS q LEFT OUTER JOIN comments AS c \
              ON q.id = c.qna_id \
              WHERE q.id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('qna_detail.ejs', {data:rows, user:req.session.user});
  })
})

//질문답변 edit 페이지
router.get('/qna_edit/:id', function(req, res) {
  let sql = " SELECT id, title, content \
              FROM qna \
              WHERE id = ? ";
  let params = req.params.id;
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('qna_edit.ejs', {data:rows, user:req.session.user});
  })
})

//게시물 쓰기 라우터
router.post('/qna_post', function(req, res) {
  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;
  let post_date = postDate();

  let sql = "INSERT INTO qna (title, content, user_id, user_name, created_at) VALUES (?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_name, post_date];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("게시물작성성공");
  })
})

//댓글 쓰기 라우터
router.post('/qna_comment_post', function(req, res) {
  let comment = req.body.comment;
  let qna_id = req.body.qna_id;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;
  let post_date = postDate();

  let sql = "INSERT INTO comments (comment, qna_id, user_id, user_name, created_at) VALUES (?, ?, ?, ?, ?)";
  let params = [comment, qna_id, user_id, user_name, post_date];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.send("댓글작성성공");
  })
})

function postDate() {
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {year: 'numeric',});
  const month = today.toLocaleDateString('en-US', {month: '2-digit',});
  const day = today.toLocaleDateString('en-US', {day: '2-digit',});
  return `${year}-${month}-${day}`;
}

//router 변수를 외부 노출
module.exports = router;