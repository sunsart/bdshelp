//checkbox 선택 >> 선택된 특약사항 컬러 변경
$(document).ready(function() {
  $('.checkbox').click(function() {
		//선택된 checkbox의 같은 row의 lebel 가져오기 
		let tr = $(this).parent().parent();
 		let td = tr.children();
		let label = td.eq(1).children();

		if (this.checked == true)
			label[0].style.color = "blue";
		else 
			label[0].style.color = "darkgray";
	})
});

//특약 체크박스 선택후 >> 작성하기 버튼 클릭시
$(document).ready(function() {
  $('.copy-button').click(function(e) {

		//1. 테이블에서 선택한 특약내용을 textarea 에 보여주기
		let contentStr = "";
		for (let i=0; i<$('.checkbox').length; i++) {
			if ($('.checkbox')[i].checked == true){
				contentStr += $('.table-clause-content')[i].innerText;
				contentStr += "\n";
			}
		}
		document.getElementById("copy-content").innerHTML = contentStr;

		//2. Clipboard.js를 이용하여 선택한 특약내용을 clipboard에 카피하기
		var clipboard = new ClipboardJS(".copy-button");
		clipboard.on('success', function (e) {
			console.log(e);
		});
		clipboard.on('error', function (e) {
			console.log(e);
		});
	})
});
