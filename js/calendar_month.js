let calendar;

document.addEventListener('DOMContentLoaded', function() {
  //캘린더 헤더 옵션
  const headerToolbar = {
    left: 'title',
    center: 'addEventButton',
    right: 'today prev next'
  }

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
		droppable : true,  //캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용
		editable : true,   //이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용
    fixedWeekCount : false,
    dayMaxEventRows: true,  // Row 높이보다 많으면 +숫자 more 링크 표시
		nowIndicator: true, // 현재 시간 마크
    displayEventTime: false, // 시간 표시 x, 하루이상 일정등록시 end날짜 포함
    //eventBackgroundColor: , //이벤트의 배경색을 설정
    //eventBorderColor: , //  이벤트의 테두리 색을 설정합니다.
		locale: 'ko', // 한국어 설정
    events: [ // 캘린더에 표시할 이벤트 데이터를 정의          
      {            
        title: '어린이날',            
        start: '2024-05-05', 
        backgroundColor : "#008000"
        // color 값을 추가해 색상도 변경 가능         
      },          
      {            
        title: '이삿날',            
        start: '2024-05-07',            
        end: '2024-05-10',
        backgroundColor : "blue"      
      },          
      {            
        groupId: 999,            
        title: 'Repeating Event',            
        start: '2024-05-13T16:00:00'          
      },          
    ]
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
      console.log("eClick:", info);
      console.log('Event: ', info.event.extendedProps);
      console.log('Coordinates: ', info.jsEvent);
      console.log('View: ', info.view);
      // 재미로 그냥 보더색 바꾸깅
      info.el.style.borderColor = 'red';
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
  document.querySelector(".background_modal").className = "background_modal show_modal";
  document.querySelector("#title").value = "";
}

function closeModal() { 
  document.querySelector(".background_modal").className = "background_modal";
}

function addCalendar() { 
  let content = document.querySelector("#title").value;
  let start_date = document.querySelector("#start_date").value;
  let end_date = document.querySelector("#end_date").value;
  
  if(content == null || content == "") {
    alert("일정내용을 입력하세요");
  } else if(start_date == "" || end_date =="") {
    alert("날짜를 입력하세요");
  } else if(new Date(end_date)- new Date(start_date) < 0) { // date 타입으로 변경 후 확인
    alert("종료일이 시작일보다 먼저입니다");
  } else { 
    let obj = {
      "title" : content,
      "start" : start_date,
      "end" : end_date
    } 
    console.log(obj); // 서버로 해당 객체를 전달해서 DB 연동 가능
    calendar.addEvent(obj);
    closeModal();
  }
}