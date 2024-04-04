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
  res.render('index.ejs', {user:req.session.user});
})

//로그인 페이지
router.get('/login', function(req, res) {
  res.render('login.ejs', {user:req.session.user});
})

//회원가입 페이지
router.get('/signup', function(req, res) {
  res.render('signup.ejs', {user:req.session.user});
})

//특약사항 페이지
router.get('/clause', function(req, res) {
  let clauseType = "apt_trade";

  if(req.session.user) {
    //로그인 되어 있으면
    // let sql = " SELECT BASICS.title, BASICS.content \
    //             FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
    //             LEFT OUTER JOIN (SELECT * FROM clauses AS cl WHERE cl.account_id = ?) CLAUSES \
    //             ON BASICS.id = CLAUSES.clause_id ";
    // let params = [clauseType, req.session.user.id];

    let sql = " SELECT BASICS.title, BASICS.content \
                FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
                LEFT OUTER JOIN clauses \
                ON BASICS.id = clauses.clause_id \
                WHERE clauses.clause_id IS NOT NULL ";
    let params = [clauseType];

    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user});
    })

    //WHERE table_member.title_m NOT IN ('NULL', '') OR table_default.title NOT IN ('NULL', '')";

  } else {
    //로그인 되어 있지 않으면
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user});
    })
  }
});

//특약사항 페이지, 시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
router.get('/type/:id', function(req, res) {
  let clauseType = req.params.id;
  let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
  let params = [clauseType];
  conn.query(sql, params, function(err, rows){
    if(err) throw err;
    res.render('clause.ejs', {data:rows, user:req.session.user});
  })
}) 

//에디트 라우터(모달에서 수정)
router.post('/edit', function(req, res) {
  //let type;
  let title = req.body.title;
  let content = req.body.content;
  let account_id = req.session.user.id;
  let clause_id = req.body.clauseNum;

  console.log("회원번호 : " + account_id);
  console.log("특약번호 : " + clause_id);

  //멤버의 기존 데이터가 존재하는지 확인
  let sql = "SELECT * FROM clauses WHERE account_id=? AND clause_id=?";
  let params = [account_id, clause_id];
  conn.query(sql, params, function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      //존재하면 update
      console.log("기존 회원의 테이터가 존재함...");
      let sql = "UPDATE clauses SET title=?, content=? WHERE account_id=? AND clause_id";
      let params = [title, content, account_id, clause_id];
      conn.query(sql, params, function(err, result) {
        if(err) throw err;
        res.send("특약수정성공");
      })
    } else {
      //존재하지 않으면 insert
      console.log("기존 회원의 테이터가 존재하지 않음...");
      let sql = "INSERT INTO clauses (title, content, account_id, clause_id) VALUES (?, ?, ?, ?)";
      let params = [title, content, account_id, clause_id];
      conn.query(sql, params, function(err, result) {
        if(err) throw err;
        res.send('특약저장성공');
      })
    }
  })
});

//router 변수를 외부 노출
module.exports = router;