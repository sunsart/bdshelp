//코드번호 [확인] 버튼 클릭시
function confirmCode() {
  let codeNum = localStorage.getItem('codeNum');
  let memberNum = localStorage.getItem('memberNum');
  //console.log("코드넘버 확인 = " + codeNum);
  //console.log("회원 고유넘버 확인 = " + memberNum);

  //입력코드 6자리 확인
  let sixcode = document.querySelector("#sixcode").value;
  if (sixcode.length != 6) {
    alert("6자리의 코드번호를 입력해주세요");
    return;
  }
  //입력코드 일치여부 확인
  if (codeNum == sixcode) 
    unfoldWindow();
  else 
    alert("코드번호가 일치하지 않습니다");
}

//[취소] 버튼 클릭시 >> 창 닫기
function closeEditpw() { 
  document.querySelector(".background_editpw").className = "background_editpw";
  foldWindow();  
}

//[비밀번호 변경] 버튼 클릭 >> 비번변경 + 얼럿창 + 창닫기
function changePw() {
  let pw1 = $('#to_pw1').val();
  let pw2 = $('#to_pw2').val();
  let memberNum = localStorage.getItem('memberNum');
  if (pw1 == "") {
    alert("비밀번호를 입력해주세요");
    return;
  }
  if (pw2 == "") {
    alert("비밀번호를 재입력해주세요");
    return;
  }
  if (pw1 != pw2) {
    alert("비밀번호가 서로 일치하지 않습니다");
    return;
  }
  $.ajax({
    url : "/changePw",
    type : "POST",
    data : {pw:pw1, memberId:memberNum},
    success : function(data) {
      if(data == "비밀번호변경성공") 
        alert("비밀번호가 변경되었습니다");
        window.location.href = '/';
    }
  })
  
  //창 닫기
  document.querySelector(".background_editpw").className = "background_editpw";
  foldWindow();  
}

//editpw 초기화면으로 접기
function foldWindow() {
  //코드넘버 확인부분 활성화
  document.querySelector("#confirm_code").style.display = 'block';
  //비밀번호 재설정 부분 비활성화
  document.querySelector("#change_password").style.display = 'none';
  //창 크기 조절
  document.querySelector(".popup_editpw").style.height = '140px';
  //localStorage 값 삭제
  localStorage.removeItem('codeNum');
  localStorage.removeItem('memberNum');
  //입력내용 초기화
  resetInput(); 
}

//editpw 비밀번호재설정으로 펼치기
function unfoldWindow() {
  //코드넘버 확인부분 비활성화
  document.querySelector("#confirm_code").style.display = 'none';
  //비밀번호 재설정 부분 활성화
  document.querySelector("#change_password").style.display = 'block';
  //창 크기 조절
  document.querySelector(".popup_editpw").style.height = '330px';
  //입력내용 초기화
  resetInput();
}

//입력창 초기화
function resetInput() {
  document.querySelector("#sixcode").value = "";  
  document.querySelector("#to_pw1").value = "";  
  document.querySelector("#to_pw2").value = ""; 
}