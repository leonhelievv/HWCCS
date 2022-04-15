//day of week rolodex

//prevent default
const dayWeekRolodex = document.getElementById("dayWeek")
//dayWeekRolodex.addEventListener("onmousemove", function(event){
//  event.preventDefault()
//});

function dayRolodexStart() {
	//var move = this.event
	//event.preventDefault();
	//startX = move.changedTouches[0].clientX
	//startY = move.changedTouches[0].clientY
	console.log('day rolodex start ')
}

function dayRolodexMove() {
	console.log('day rolodex move')
}

function dayRolodexEnd() {
	console.log('day rolodex end')
}

dayWeekRolodex.addEventListener('touchstart',dayRolodexStart)
dayWeekRolodex.addEventListener('touchmove',dayRolodexMove)
dayWeekRolodex.addEventListener('touchend',dayRolodexEnd)


function makeWeek() {
	//get the menu template from specs
	var prevId = 100
	for (let id = 100; id < 107; id++) {
 
		//create new canvas
		var htmlString = '<canvas id='+id+' width="200" height="80"></canvas>'
		
		if (id == 100) {
			//it is the first menu item - the first canvas to be created
			entryPoint = document.getElementById('dayWeek');
			entryPoint.insertAdjacentHTML('afterbegin', htmlString);
		}else{
			//it is not the first menu item - use the ID of the previous one
			entryPoint = document.getElementById(prevId);
			entryPoint.insertAdjacentHTML('afterend', htmlString);
		}
		
		//add eventlistener to canvas
		document.getElementById(id).addEventListener('touchstart',dayTouch)
		document.getElementById(id).addEventListener('touchmove',dayTouch)
		document.getElementById(id).addEventListener('touchend',dayTouch)

		//draw the day details
  	 	//make drawing array from template - use the template name in spec
   
   	drawing = makeDrawingArray(dayBlock,1,20,'ctx');
   	//modToZero2(drawing,'ctx3')
   	//modToNew2(drawing,0,30,'ctx3')
   
  		//draw the menu item on its canvas
  		var ctx3 = document.getElementById(id).getContext("2d");
		drawOnCanvas(drawing,0,0,'rgb(67, 157, 203)','rgb(252, 253, 0)',ctx3)
		
		//add the text : t,txtX,txtY,fill,theCtx
		addPuzTxt(dayWeek[id-100],45,65,'rgb(255,255,255)',ctx3)
		
		prevId = id
	}
	
}

var dayTouchmove = false
var selectedDay = 'none'

function dayTouch(x) {
	var day = x.currentTarget.id
	
	if (x.type == 'touchstart') {
		console.log('day touch , day is : '+ day +'  type '+ x.type)
		dayTouchmove = false
	}else if (x.type == 'touchmove') {
		console.log('day touch , day is : '+ day +'  type '+ x.type)
		dayTouchmove = true
	}else if (x.type == 'touchend') {
		console.log('day touch , day is : '+ day +'  type '+ x.type)
		
		if (dayTouchmove == false) {
			//day was tapped - de select the previous selected day - select new day
			const sd = selectedDay
			selectedDay = day
		
			if (sd != 'none') {
			//clear previuous selected day canvas - context.clearRect(x,y,width,height);
			const pCtx = document.getElementById(sd).getContext("2d");
			pCtx.clearRect(0,0,200,80);
			//restore to not selected
			//draw day block on canvas
			drawing = makeDrawingArray(dayBlock,1,20,'ctx');
			drawOnCanvas(drawing,0,0,'rgb(67, 157, 203)','rgb(252, 253, 0)',pCtx)		
			//add the text : t,txtX,txtY,fill,theCtx
			addPuzTxt(dayWeek[sd-100],45,65,'rgb(255,255,255)',pCtx)
			//update the 24 hour GUI with day data
			upDateGui24hr()
			}
			
			drawing = makeDrawingArray(dayBlock,1,1,'ctx');
   		//modToZero2(drawing,'ctx3')
   		//modToNew2(drawing,0,30,'ctx3')
  			//draw the menu item on its canvas
  			var ctx3 = document.getElementById(day).getContext("2d");
  			ctx3.clearRect(0,0,200,80);
			drawOnCanvas(drawing,0,0,'rgb(72, 212, 77)','rgb(252, 253, 0)',ctx3)
			//add the text : t,txtX,txtY,fill,theCtx
			addPuzTxt(dayWeek[day-100],45,50,'rgb(255,255,255)',ctx3)		
			//update the 24 hour GUI with day data
			upDateGui24hr()
			
		}else {
			//day was touched but moved - do not select the day
		}		
	}
}

function getDayOfWeek(theYear,monthIndex,dayN) {
	//const d = new Date();
	//const d = new Date("July 21, 1983 01:15:00");
	const d = new Date(monthName[monthIndex] + dayN +','+ theYear + ' 3 01:00:00');
	let day = d.getDay()
	console.log('the date : '+d+ ' the day of week is : '+dayWeek[day-1])
	console.log(day)
	return dayWeek[day-1]
}
