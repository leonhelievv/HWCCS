
function confirmOk(cAtx,cAty) {
	
	var anmSteps = 20
	
	//draw a ok tick off on canvas
	feedBack1.style.display = 'block'
	//feedBack1.left = cAtx
	feedBack1.style.top = cAty +'px'
	//get width of schedule ?
	feedBack1.style.left = (cAtx+300)+'px'
	//what context
	
	const thisCtx = feedBack1.getContext("2d");
	thisCtx.lineWidth = 1.931723;
	//make okTick drawing array
	var drwng = makeDrawingArray(okTick,0,120,'ctx')
	drwng = modToZero2(drwng,'ctx')
	drwng = modToNew(drwng,0,40)
	//draw okTick on canvas
	drawOnCanvas(drwng,0,0,'rgb(2, 189, 55)','rgb(26, 102, 47)',thisCtx)
	//set time interval to make confirm Ok progressively smaller
	const anmT = setInterval(anmtConfirmOk, 50)


function anmtConfirmOk() {
	if (anmSteps > 0) {
		//do a nother step
		anmSteps = anmSteps - 2
		var wdt = feedBack1.style.width
		//reduce the canvas size
		feedBack1.style.width = (400/anmSteps)+'px'
	}else{
		feedBack1.style.width = 100+'px'
		//all steps done - clear interval
		clearInterval(anmT)
	}
}
return 'done'
}

function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function calcDaysInMonth(theYear,monthIndex) {
	var dt = new Date();
	dt.setFullYear(theYear, monthIndex+1, 3);
 	var month = dt.getMonth();
 	console.log('month '+month)
 	var year = dt.getFullYear();
 	console.log('year '+year)
	daysInMonth = new Date(year, month, 0).getDate();
	console.log(monthName[monthIndex] + 'has days :' + daysInMonth)
	return daysInMonth
}

function calcDayWeek(date) {
	const d = new Date(date);
	let day = d.getDay();
 	//console.log(date +dayWeek[day])
 	return day
}

function rgbToHex(rgbC) {
	//rgb(255,255,255)
	var r, g, b
	var stript = rgbC.slice(4)
	var stript = stript.slice(0,-1)
	var clrArray = stript.split(',')
	r = parseInt(clrArray[0])
	g = parseInt(clrArray[1])
	b = parseInt(clrArray[2])
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

