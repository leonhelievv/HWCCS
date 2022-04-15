//month selector

//prevent default
const monthSelect = document.getElementById("monthSelect")


function monthSelectStart() {
	//var move = this.event
	//event.preventDefault();
	//startX = move.changedTouches[0].clientX
	//startY = move.changedTouches[0].clientY
	console.log('month selection start ')
}

function monthSelectMove() {
	console.log('month selection move')
}

function monthSelectEnd() {
	console.log('month selection end')
}

monthSelect.addEventListener('touchstart',monthSelectStart)
monthSelect.addEventListener('touchmove',monthSelectMove)
monthSelect.addEventListener('touchend',monthSelectEnd)


function makeMonth() {
	//get the menu template from specs
	var prevId = 200
	for (let id = 200; id < 212; id++) {
 
		//create new canvas
		var htmlString = '<canvas id='+id+' width="200" height="80"></canvas>'
		
		if (id == 200) {
			//it is the first menu item - the first canvas to be created
			entryPoint = document.getElementById('monthSelect');
			entryPoint.insertAdjacentHTML('afterbegin', htmlString);
		}else{
			//it is not the first menu item - use the ID of the previous one
			entryPoint = document.getElementById(prevId);
			entryPoint.insertAdjacentHTML('afterend', htmlString);
		}
		
		//add eventlistener to canvas
		document.getElementById(id).addEventListener('touchstart',monthTouch)
		document.getElementById(id).addEventListener('touchmove',monthTouch)
		document.getElementById(id).addEventListener('touchend',monthTouch)

		//draw the day details
  	 	//make drawing array from template - use the template name in spec
   
   	drawing = makeDrawingArray(monthBlock,1,20,'ctx');
   	//modToZero2(drawing,'ctx3')
   	//modToNew2(drawing,0,30,'ctx3')
   
  		//draw the menu item on its canvas
  		var ctx3 = document.getElementById(id).getContext("2d");
		drawOnCanvas(drawing,0,0,'rgb(67, 157, 203)','rgb(252, 253, 0)',ctx3)
		
		//add the text : t,txtX,txtY,fill,theCtx
		addPuzTxt(monthName[id-200],45,65,'rgb(255,255,255)',ctx3)
		
		prevId = id
	}
	
}

var monthTouchmove = false
var selectedMonth = 'none'

function monthTouch(x) {
	var theMonth = x.currentTarget.id
	const monthNo = parseInt(theMonth)
	
	if (x.type == 'touchstart') {
		console.log('month touch , month is : '+ theMonth +'  type '+ x.type)
		monthTouchmove = false
	}else if (x.type == 'touchmove') {
		console.log('month touch , month is : '+ theMonth +'  type '+ x.type)
		monthTouchmove = true
	}else if (x.type == 'touchend') {
		console.log('month touch , month is : '+ theMonth +'  type '+ x.type)
		
		if (monthTouchmove == false) {
			//month was tapped - de select the previous selected month - select new month
			const prevSelect = selectedMonth
			selectedMonth = monthNo
		
			if (prevSelect != 'none') {
			//clear previuous selected month canvas - context.clearRect(x,y,width,height);
			const pCtx = document.getElementById(prevSelect).getContext("2d");
			pCtx.clearRect(0,0,200,80);
			//restore to not selected
			//draw month block on canvas
			drawing = makeDrawingArray(monthBlock,1,20,'ctx');
			drawOnCanvas(drawing,0,0,'rgb(67, 157, 203)','rgb(252, 253, 0)',pCtx)		
			//add the text : t,txtX,txtY,fill,theCtx
			addPuzTxt(monthName[prevSelect-200],45,65,'rgb(255,255,255)',pCtx)
			//update the 24 hour GUI with month data
			
			}
			
			drawing = makeDrawingArray(monthBlock,1,1,'ctx');
   		//modToZero2(drawing,'ctx3')
   		//modToNew2(drawing,0,30,'ctx3')
  			//draw the menu item on its canvas
  			var ctx3 = document.getElementById(theMonth).getContext("2d");
  			ctx3.clearRect(0,0,200,80);
			drawOnCanvas(drawing,0,0,'rgb(72, 212, 77)','rgb(252, 253, 0)',ctx3)
			//add the text : t,txtX,txtY,fill,theCtx
			addPuzTxt(monthName[monthNo-200],45,50,'rgb(255,255,255)',ctx3)		
			//update the 24 hour GUI with month data
			
			
		}else {
			//month was touched but moved - do not select the month
		}		
	}
}
