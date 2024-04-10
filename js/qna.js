//
function insertQna() {
  $.ajax({
    url : "/qna_write",
    type : "POST",
    data : {title:title, content:content},
    success : function(data) {
      if(data == "게시물작성성공") {
        alert("등록 되었습니다")
        window.location.href = '/qna';
      }
    }
  })
  
}