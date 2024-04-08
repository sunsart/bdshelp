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

//clause-name 전역변수
let clauseType = "";

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
  clauseType = "apt_trade";
  if(req.session.user) {
    //로그인 되어 있으면
    let sql = " (SELECT cl.clause_id AS 'id', cl.title, cl.content FROM clauses AS cl WHERE cl.account_id=? AND cl.type=?) \
                UNION ALL \
                (SELECT BASICS.id, BASICS.title, BASICS.content \
                FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
                LEFT OUTER JOIN (SELECT * FROM clauses AS cl WHERE cl.account_id = ? AND cl.type=?) CLAUSES \
                ON BASICS.id = CLAUSES.clause_id \
                WHERE CLAUSES.clause_id IS NULL) \
                ORDER BY id ASC ";
    let params = [req.session.user.id, clauseType, clauseType, req.session.user.id, clauseType];
    conn.query(sql, params, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  } else {
    //로그인 되어 있지 않으면
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  }
});

//특약사항 페이지, 시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
router.get('/type/:id', function(req, res) {
  clauseType = req.params.id;
  if(req.session.user) {
    //로그인 되어 있으면
    let sql = " (SELECT cl.clause_id AS 'id', cl.title, cl.content FROM clauses AS cl WHERE cl.account_id=? AND cl.type=?) \
                UNION ALL \
                (SELECT BASICS.id, BASICS.title, BASICS.content \
                FROM (SELECT * FROM basics AS ba WHERE ba.type = ?) BASICS \
                LEFT OUTER JOIN (SELECT * FROM clauses AS cl WHERE cl.account_id = ? AND cl.type=?) CLAUSES \
                ON BASICS.id = CLAUSES.clause_id \
                WHERE CLAUSES.clause_id IS NULL) \
                ORDER BY id ASC ";
    let params = [req.session.user.id, clauseType, clauseType, req.session.user.id, clauseType];
    conn.query(sql, params, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  } else {
    //로그인 되어 있지 않으면
    let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
    conn.query(sql, clauseType, function(err, rows) {
      if(err) throw err;
      res.render('clause.ejs', {data:rows, user:req.session.user, type:setClauseName(clauseType)});
    })
  }
}) 

//에디트 라우터(모달에서 수정)
router.post('/edit', function(req, res) {
  let type = clauseType;
  let title = req.body.title;
  let content = req.body.content;
  let account_id = req.session.user.id;
  let clause_id = req.body.clauseNum;

  console.log("[edit 라우터]");
  console.log("회원번호 : " + account_id);
  console.log("특약번호 : " + clause_id);
  console.log(`특약타입 : ${type}`);

  //멤버의 기존 데이터가 존재하는지 확인
  let sql = "SELECT * FROM clauses WHERE account_id=? AND clause_id=?";
  let params = [account_id, clause_id];
  conn.query(sql, params, function(err, result, fields) {
    if(err) throw err;
    if(result.length > 0) {
      //존재하면 update
      console.log("기존 회원의 테이터가 존재함...");
      let sql = "UPDATE clauses SET title=?, content=? WHERE account_id=? AND clause_id=?";
      let params = [title, content, account_id, clause_id];
      conn.query(sql, params, function(err, result) {
        if(err) throw err;
        res.send("특약수정성공");
      })
    } else {
      //존재하지 않으면 insert
      console.log("기존 회원의 테이터가 존재하지 않음...");
      let sql = "INSERT INTO clauses (type, title, content, account_id, clause_id) VALUES (?, ?, ?, ?, ?)";
      let params = [type, title, content, account_id, clause_id];
      conn.query(sql, params, function(err, result) {
        if(err) throw err;
        res.send("특약저장성공");
      })
    }
  })
});

function setClauseName(eng) {
  let kor;
  if (eng == "apt_trade") kor = "아파트 매매 특약사항"
  else if (eng == "apt_jeonse") kor = "아파트 전세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"
  else if (eng == "apt_monthly") kor = "아파트 월세 특약사항"

  else if (eng == "officetel_trade") kor = "오피스텔 매매 특약사항"
  else if (eng == "officetel_jeonse") kor = "오피스텔 전세 특약사항"
  else if (eng == "officetel_monthly") kor = "오피스텔 월세 특약사항"

  else if (eng == "dasedae_trade") kor = "다세대 매매 특약사항"
  else if (eng == "dasedae_jeonse") kor = "다세대 전세 특약사항"
  else if (eng == "dasedae_monthly") kor = "다세대 월세 특약사항"

  else if (eng == "dagagu_trade") kor = "다가구 매매 특약사항"
  else if (eng == "dagagu_jeonse") kor = "다가구 전세 특약사항"
  else if (eng == "dagagu_monthly") kor = "다가구 월세 특약사항"

  else if (eng == "oneroom_jeonse") kor = "원룸 전세 특약사항"
  else if (eng == "oneroom_monthly") kor = "원룸 월세 특약사항"

  else if (eng == "shop_trade") kor = "상가 매매 특약사항"
  else if (eng == "shop_monthly") kor = "상가 월세 특약사항"

  else if (eng == "factory_trade") kor = "공장 매매 특약사항"
  else if (eng == "factory_monthly") kor = "공장 월세 특약사항"

  else if (eng == "land_trade") kor = "토지 매매 특약사항"
  else if (eng == "land_monthly") kor = "토지 월세 특약사항"

  else if (eng == "etc") kor = "기타 특약사항"
  return kor;
}

//router 변수를 외부 노출
module.exports = router;