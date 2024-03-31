//로그인창의 [비밀번호 찾기] 버튼 클릭시 >> 창 열기
function showFindpw() {
  //로그인창 닫기
  //document.querySelector(".background_login").className = "background_login";
  
  //비밀번호 찾기 창 열기
  document.querySelector(".background-findpw").className = "background-findpw show-findpw";

  //이전 기입내용 삭제
  document.getElementById('findpw-name').value = "";  
  document.getElementById('findpw-email').value = "";        
}

//[취소] 버튼 클릭시 >> 창 닫기
function closeFindpw() { 
  document.querySelector(".background-findpw").className = "background-findpw";
}

//[비밀번호 찾기] 버튼 클릭시
// function findpw(){
//   let name = $('#findpw_name').val();
//   let email = $('#findpw_email').val();
//   const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

//   if (name == "" ) 
//     alert("아이디를 입력해주세요");
//   else if (email == "")
//     alert("이메일 주소를 입력해주세요");
//   else if (pattern.test(email) === false)
//     alert("이메일 형식이 올바르지 않습니다");
//   else {
//     $.ajax({
//       url : "/findpw",
//       type : "POST",
//       data : {name:name, email:email},
//       success : function(data) {
//         if(data == "비밀번호찾기실패") 
//           alert("일치하는 정보를 찾을 수 없습니다");
//         else {
//           alert(data.address + "의 메일주소로 6자리 숫자코드를 발송했습니다");
//           localStorage.setItem('codeNum', data.codeNum);
//           localStorage.setItem('memberNum', data.memberNum);
//           document.querySelector(".background_findpw").className = "background_findpw";
//           document.querySelector(".background_editpw").className = "background_editpw show_editpw";
//         }
//       }
//     })
//   }
// }
