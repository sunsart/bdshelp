//.env 환경변수 사용
const dotenv = require('dotenv').config();

//nodejs 와 mysql 접속, auth, list ??
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

//----------세션 미들웨어 설정----------
//사용자마다 고유한 req.session 객체가 생성됨
let session = require('express-session');
let mysqlstore = require('express-mysql-session')(session);
let option = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
}
let sessionStore = new mysqlstore(option);

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  store : sessionStore,
  cookie : { maxAge: 3600000 }  //1시간
}))
//---------------------------------------

//게시판 조회수 중복제거에 사용 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//post방식의 데이터 사용을 위한 body-parser 설정
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//뷰엔진 설정
app.set('view engine', 'ejs');

//서버가 정적파일을 제공하도록 하기 위한 설정
app.use(express.static(__dirname + ''));

//라우터 분리
app.use('/', require('./routes/auth.js'));
app.use('/', require('./routes/list.js'));
app.use('/', require('./routes/news.js'));
app.use('/', require('./routes/qna.js'));

app.listen(8080, function(){
  console.log("포트 8080으로 서버 대기중 ...")
}); 



