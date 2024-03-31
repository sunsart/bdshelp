function showFindid() {
  //로그인창 닫기
  //document.querySelector(".background-login").className = "background_login";

  //아이디찾기 창 열기
  document.querySelector(".background-findid").className = "background-findid show-findid";

  //이전 기입내용 삭제
  document.getElementById('findid-email').value = "";
}

//아이디찾기 창 닫기
function closeFindid() { 
  document.querySelector(".background-findid").className = "background-findid";
}

//[아이디찾기] 버튼 클릭시 >> 휴효성검사 >> 결과표시
// function findId(){
//   let email = $('#findId_email').val();
//   const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
//   if (email == "") 
//     alert("이메일 주소를 입력해주세요")
//   else if (pattern.test(email) === false) 
//     alert("이메일 형식이 올바르지 않습니다")
//   else {
//     $.ajax({
//       url : "/findID",
//       type : "POST",
//       data : {email:email},
//       success : function(data) {
//         if(data == "아이디찾기실패") 
//           alert("입력하신 이메일 정보를 확인할 수 없습니다")
//         else {
//           let text = "찾으시는 아이디는 " + data + " 입니다";
//           alert(text);
//           window.location.href = '/';
//         }
//       }
//     })
//   }
// }