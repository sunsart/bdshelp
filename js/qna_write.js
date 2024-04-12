//
function postQna() {
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;

  if(title == "")
    alert("제목을 입력하세요");
  else if(content == "")
    alert("내용을 입력하세요");
  else {
    $.ajax({
      url : "/qna_post",
      type : "POST",
      data : {title:title, content:content},
      success : function(data) {
        if(data == "게시물작성성공") {
          alert("등록 되었습니다")
          window.location.href = '/qna_list';
        }
      }
    })
  }
}

//댓글 저장
function postComment() {
  let comment = document.getElementById("comment-content").value;
  let qna_id = document.getElementById("qna-id").value;

  if(comment == "")
    alert("댓글을 입력하세요");
  else {
    $.ajax({
      url : "/qna_comment_post",
      type : "POST",
      data : {comment:comment, qna_id:qna_id},
      success : function(data) {
        if(data == "댓글작성성공") {
          alert("등록 되었습니다")

          //리다이렉트
          window.location.href = '/qna_detail/' + qna_id;
        }
      }
    })
  }
}