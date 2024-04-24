const multer = require('multer');
const path = require('path');

//라우터 객체
let router = require('express').Router();

// //nodejs 와 mysql 접속
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE
});
conn.connect();

//-----------------------------------------//

//부동산서식 리스트 페이지
router.get('/document_list', function(req, res) {
  let sql = " SELECT id, title, content, user_id, user_name, down, created_at \
              FROM document \
              ORDER BY id DESC";
  conn.query(sql, function(err, rows) {
    if(err) throw err;
    res.render('document_list.ejs', {data:rows, user:req.session.user});
  })
})

//부동산서식 등록 페이지
router.get('/document_write', function(req, res) {
  res.render('document_write.ejs', {user:req.session.user});
})


//쓰기 라우터
// router.post('/document_upload', function(req, res) {
//   let title = req.body.title;
//   let content = req.body.content;
  
//   let user_id = req.session.user.id;
//   let user_name = req.session.user.name;
//   let upload_date = postDate();

//   let sql = " INSERT INTO document (title, content, user_id, user_name, created_at) VALUES (?, ?, ?, ?, ?)";
//   let params = [title, content, user_id, user_name, upload_date];
//   conn.query(sql, params, function(err, result) {
//     if(err) throw err;
//     res.redirect("/document_list");
//   })
// })


//파일 업로드
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, done){
      done(null, "uploads/");
    },
    filename: function(req, file, done){
      const ext = path.extname(file.originalname); // 확장자명 ex.hwp
      const baseName = path.basename(file.originalname, ext);  // 파일명 ex.정산양식
      let changed_name = baseName + "_" + Date.now() + ext; // 정산양식_2324343.hwp  
      changed_name = Buffer.from(changed_name, "latin1").toString("utf8");      
      done(null, changed_name);
    }
  }),
  limits: {fileSize: 2 * 1024 * 1024} // 2 MB 제한
});

router.post("/document_upload", upload.single("file"), (req, res)=>{
  if(!req.file) 
    return res.status(400).json({ error: '이미지를 업로드해주세요.' });

  let title = req.body.title;
  let content = req.body.content;
  let user_id = req.session.user.id;
  let user_name = req.session.user.name;
  let upload_date = postDate();
  let original_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
  let changed_name = req.file.filename;

  let sql = " INSERT INTO document \
              (title, content, user_id, user_name, created_at, original_name, changed_name) \
              VALUES (?, ?, ?, ?, ?, ?, ?)";
  let params = [title, content, user_id, user_name, upload_date, original_name, changed_name];
  conn.query(sql, params, function(err, result) {
    if(err) throw err;
    res.redirect("/document_list");
  })
});

//현재 날짜 가져오기
function postDate() {
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {year: 'numeric',});
  const month = today.toLocaleDateString('en-US', {month: '2-digit',});
  const day = today.toLocaleDateString('en-US', {day: '2-digit',});
  return `${year}-${month}-${day}`;
}

//router 변수를 외부 노출
module.exports = router;