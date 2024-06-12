// write find
function postFind() {
  let title = document.getElementById("title").value;
  let region = document.getElementById("region").value;
  let area = document.getElementById("area").value;
  let cost = document.getElementById("cost").value;
  let tel = document.getElementById("tel").value;
  let etc = document.getElementById("etc").value;
  
  // 전화번호 정규식, 000-0000-0000
  const regexPhoneNum = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/;

  if(title == "")
    alert("제목을 입력하세요");
  else if(tel == "")
    alert("연락처를 입력하세요");
  else if(regexPhoneNum.test(tel) === false)
    alert("전화번호 형식이 올바르지 않습니다");
  else if(etc == "")
    alert("내용을 입력하세요");
  else {
    $.ajax({
      url : "/find_post",
      type : "POST",
      data : {title:title, region:region, area:area, cost:cost, tel:tel, etc:etc},
      success : function(data) {
        if(data == "매물찾아요작성성공") {
          alert("등록 되었습니다")
          window.location.href = '/find_list';
        }
      }
    })
  }
}

// 매물찾아요 게시물 수정
function editFind() {
  let find_id = document.getElementById("find_id").value;
  let title = document.getElementById("title").value;
  let region = document.getElementById("region").value;
  let area = document.getElementById("area").value;
  let cost = document.getElementById("cost").value;
  let tel = document.getElementById("tel").value;
  let etc = document.getElementById("etc").value;

  // 전화번호 정규식, 000-0000-0000
  const regexPhoneNum = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/;
  
  if(title == "")
    alert("제목을 입력하세요");
  else if(tel == "")
    alert("연락처를 입력하세요");
  else if(regexPhoneNum.test(tel) === false)
    alert("전화번호 형식이 올바르지 않습니다");
  else if(etc == "")
    alert("내용을 입력하세요");
  else {
    $.ajax({
      url : "/find_edit",
      type : "POST",
      data : {find_id:find_id, title:title, region:region, area:area, cost:cost, tel:tel, etc:etc},
      success : function(data) {
        if(data == "매물찾아요수정성공") {
          alert("수정했습니다")
          window.location.href = '/find_detail/' + find_id;
        }
      }
    })
  }
}

//delete find
function deleteFind() {
  if(confirm("게시글을 삭제하시겠습니까?")) {
    let find_id = document.getElementById("find_id").value;
    $.ajax({
      url : "/find_delete",
      type : "POST",
      data : {find_id:find_id},
      success : function(data) {
        if(data == "게시물삭제성공") {
          alert("게시글을 삭제했습니다")
          window.location.href = '/find_list';
        }
      }
    })
	}
}

