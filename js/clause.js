//모달 내 확인버튼 클릭시
function confirmModal() { 
  //let num = document.getElementById("contract_no").value;
  let title = document.querySelector(".edit-title").value;
  let content = document.querySelector(".edit-content").value;
 
  // $.ajax({
  //   url : "/edit",
  //   type : "POST",
  //   data : {num:num, title:title, content:content},
  //   success : function(data) {
  //     if(data == "특약수정성공") 
  //       alert("특약사항을 수정했습니다");
  //   }
  // })
  
  //모달 닫기
  closeModal();

  //특약수정된 결과 바로 볼수 있게
  //window.location.href = '/';
}

//모달 내 취소버튼 클릭시
function closeModal() { 
  let modal = document.getElementById("edit-modal");
  modal.style.display = "none";
}