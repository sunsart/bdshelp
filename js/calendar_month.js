let calendar;
let isLogin;  // 로그인 여부

document.addEventListener('DOMContentLoaded', function() {
  // todo
  const addBtn = document.querySelector('#addBtn');
  addBtn.addEventListener('click', () => {
    if(todoInput.value !== ''){ 
        createTodo();
    }
  })

  // db 저장된 일정
  let arrayData;
  let jsonData;
  let headerToolbar; // 캘린더 헤더 옵션
  if (!document.querySelector("#scheduleData").value) { 
    // 로그인 되어 있지 않으면
    isLogin = false;
    arrayData = [];
    headerToolbar = {
      left: 'title',
      right: 'today prev next'
    }
  } else {  
    // 로그인 되어 있으면
    isLogin = true;
    jsonData = document.querySelector("#scheduleData").value;
    arrayData = JSON.parse(jsonData);
    headerToolbar = {
      left: 'title',
      center: 'addEventButton',
      right: 'today prev next'
    }
  }
  console.log(arrayData);

  // 캘린더 생성 옵션
  const calendarOption = {
    height: '750px',  // calendar 높이 설정
    expandRows: true, // 화면에 맞게 높이 재설정
    initialView: 'dayGridMonth', // 초기 로드시 캘린더 화면 (기본설정: 달)
    headerToolbar: headerToolbar,
    titleFormat : function(date) {
			return date.date.year + '년 ' + (parseInt(date.date.month) + 1) + '월';
		},
    //날짜에서 "일" 제거
    dayCellContent: function(info) {
      let number = document.createElement("a");
      number.classList.add("fc-daygrid-day-number");
      number.innerHTML = info.dayNumberText.replace("일", "").replace("day", "");
      if (info.view.type === "dayGridMonth") {
        return {
          html: number.outerHTML
        };
      }
      return {
        domNodes: []
      }
    },
    customButtons: {
      addEventButton: { // 추가한 버튼 설정
        text : "일정 추가",   // 버튼 내용
        click : function() { // 버튼 클릭 시 이벤트 추가
          showModal();
        }
      }
    },
    navLinks : false,  // 날짜, 요일 클릭시 주단위, 일단위로 넘어가는 기능
		selectable : true, // 사용자가 일정 범위를 선택하여 이벤트를 추가
		droppable : false,  // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용
		editable : false,   // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용
    fixedWeekCount : false,
    dayMaxEventRows: true,  // Row 높이보다 많으면 +숫자 more 링크 표시
		nowIndicator: true, // 현재 시간 마크
    displayEventTime: false, // 시간 표시 x, 하루이상 일정등록시 end날짜 포함
    eventDisplay : 'block',
    //eventBackgroundColor: , //이벤트의 배경색을 설정
    //eventBorderColor: , //  이벤트의 테두리 색을 설정합니다.
		locale: 'ko', // 한국어 설정
    events: arrayData    // 캘린더에 표시할 이벤트 데이터를 정의 
	};

  // 캘린더 생성
  const calendarEl = document.querySelector('#calendar');
  calendar = new FullCalendar.Calendar(calendarEl, calendarOption);
  calendar.render();

  // 캘린더 이벤트 등록
  calendar.on("eventAdd", info => console.log("Add:", info));
  calendar.on("eventChange", info => console.log("Change:", info));
  calendar.on("eventRemove", info => console.log("Remove:", info));
  calendar.on("eventClick", info => {
    let result = confirm("일정을 삭제할까요?");
    if (result) {
      $.ajax({
        url : "/schedule_delete",
        type : "POST",
        data : {id:info.event.id},
        success : function(data) {
          if(data == "일정삭제성공") {
            info.event.remove();
            alert("일정을 삭제했습니다")
          }
        }
      })
    }

    // console.log(info.event.startStr.substr(0, 10));
    // console.log("eClick:", info);
    //console.log('Event: ', info.event.extendedProps);
    //console.log('Coordinates: ', info.jsEvent);
    //console.log('View: ', info.view);
    // 재미로 그냥 보더색 바꾸깅
    //info.el.style.borderColor = 'red';
  });
  //calendar.on("eventMouseEnter", info => console.log("eEnter:", info));
  //calendar.on("eventMouseLeave", info => console.log("eLeave:", info));
  //calendar.on("dateClick", info => console.log("dateClick:", info));
  calendar.on("select", info => { showModal(); });
  calendar.on("drop", info => console.log("drop:", info));
  calendar.on("eventDrop", info => console.log("eventDrop:", info));
  calendar.on("eventResize", info => console.log("eventResize:", info));

});

function showModal() {
  if (!isLogin) {
    alert("로그인이 필요합니다");
    return;
  }
  document.querySelector(".background_modal").className = "background_modal show_modal";
  document.querySelector("#title").value = "";
  document.querySelector("#start_date").value = "";
  document.querySelector("#end_date").value = "";
}

function closeModal() { 
  document.querySelector(".background_modal").className = "background_modal";
}

function closeModal2() { 
  document.querySelector(".background_modal2").className = "background_modal2";
}

function addCalendar() { 
  let title = document.querySelector("#title").value;
  let start_date = document.querySelector("#start_date").value;
  let end_date = document.querySelector("#end_date").value;
  let color = document.querySelector("#select").value;
  
  if(title == null || title == "") {
    alert("일정내용을 입력하세요");
  } else if(start_date == "") {
    alert("시작날짜를 입력하세요");
  } else if(end_date == "") {
    alert("종료날짜를 입력하세요");
  } else if(new Date(end_date)- new Date(start_date) < 0) { // date 타입으로 변경 후 확인
    alert("종료날짜가 시작날짜보다 먼저입니다!");
  } else { 
    let obj = {
      "title" : title,
      "start" : start_date + " 00:00:00", // 2일 이상 일정추가시 캘린더에 하루 적게 표시되는 것을 수정하기 위해 시간 추가
      "end" : end_date + " 24:00:00",
      "backgroundColor" : color,  
    } 

    $.ajax({
      url : "/schedule_add",
      type : "POST",
      data : {title:obj.title, start:obj.start, end:obj.end, color:obj.backgroundColor},
      success : function(data) {
        if(data == "일정등록성공") {
          calendar.addEvent(obj);
          alert("일정을 등록했습니다")
          //window.location.href = '/calendar';
        }
      }
    })

    closeModal();
  }
}

function createTodo(event) {
  const todoList = document.querySelector('#todoList');

  const newLi = document.createElement('li');       // li 생성
  const newBtn = document.createElement('button');  // button 생성
  const newSpan = document.createElement('span');   // span 생성
  const todoInput = document.querySelector('#todoInput');
    
  newLi.appendChild(newBtn); // li안에 button 담기
  newLi.appendChild(newSpan); // li안에 span 담기
  // console.log(newLi)
    
  newSpan.textContent = todoInput.value; // span 안에 value값 담기
    
  todoList.appendChild(newLi);
  // console.log(todoList)
    
  todoInput.value = ''; // value 값에 빈 문자열 담기

  newBtn.addEventListener('click', () => { // 체크박스 클릭시 완료 표시
		newLi.classList.toggle('complete');
  });
}