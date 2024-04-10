//
function postQna() {
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;

  $.ajax({
    url : "/qna_post",
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