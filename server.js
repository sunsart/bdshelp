//.env 환경변수 사용
const dotenv = require('dotenv').config();

//nodejs 와 mysql 접속
const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

const express = require('express');
const app = express();

//post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//뷰엔진 설정
app.set('view engine', 'ejs');

//서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

app.listen(8080, function(){
  console.log("포트 8080으로 서버 대기중 ...")
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/clause', function(req, res){
  let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
  let params = "apt_trade";
  conn.query(sql, params, function(err, rows) {
    if(err) throw err;
    res.render('clause.ejs', {data:rows});
  })
});

//시멘틱 url, 네비게이션바에서 메뉴 선택시 테이블 내용 변경
app.get('/type/:id', function(req, res) {
  let clauseType = req.params.id; //선택된 테이블값 전역변수에 저장
  let sql = "SELECT * FROM basics WHERE type=? AND title!=''";
  let params = [clauseType];
  conn.query(sql, params, function(err, rows){
    if(err) throw err;
    res.render('clause.ejs', {data:rows});
  })
})  

