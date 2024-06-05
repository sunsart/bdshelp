//회원가입버튼 클릭시 >> 휴효성검사 >> mysql저장
function checkSignup() {

  let id = document.getElementById("member-id").value;
  let pw1 = document.getElementById("member-pw1").value;
  let pw2 = document.getElementById("member-pw2").value;
  let email = document.getElementById("member-email").value;
  let terms = document.getElementById("terms-check");

  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (id.length < 4 || id.length >= 20) 
    alert("아이디는 4자 ~ 20자로 입력해주세요");
  else if (pw1.length < 6)
    alert("비밀번호는 6글자 이상 입력해주세요");
  else if (pw1 != pw2)
    alert("비밀번호가 서로 일치하지 않습니다");
  else if (email == "")
    alert("이메일주소를 입력해주세요");
  else if (pattern.test(email) === false) 
    alert("이메일주소 형식이 올바르지 않습니다");
  else if (terms.checked == false) 
    alert("약관에 동의해 주세요");
  else {
    $.ajax({
      url : "/signup",
      type : "POST",
      data : {id:id, pw:pw1, email:email},
      success : function(data) {
        if(data == "아이디중복") 
          alert("이미 존재하는 아이디 입니다");
        else if(data[0] == "가입성공") {
          alert("정상적으로 회원가입 되었습니다.");
          window.location.href = '/login';
        }
      }
    })
  }
}
