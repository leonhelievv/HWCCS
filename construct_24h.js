
var optionsMenu = [] //this is the reult of running through the menuItemsSpecs list 
var h24Move = false;


function findMenuItem(id) {
	menuItemIndex = 'none'
	for (let i = 0; i < optionsMenu.length; i++){
		//look for id
		if (optionsMenu[i][1] == id) {
			//the id is a match
			menuItemIndex=i
			break
		}
	}	
	return menuItemIndex
};


function clearMenu() {
	while (hours24a.firstChild) {
    hours24a.removeChild(codeMenu.firstChild);
	}

}

function construct24hOptions(p24h) {
	
	const sunR = parseInt(p24h[0].toFixed())
	const sunS = parseInt(p24h[1].toFixed())
		
	//from 0 to before sunrise
	for (let i = 0; i < sunR; i++) {
  		makeHrInOptionsMenu(i,1)
	}
	//day time sunrise to sunset
	for (let i = sunR; i <= sunS; i++) {
  		makeHrInOptionsMenu(i,0)
	}
	//sunset to 24
	for (let i = sunS+1; i < 24; i++) {
  		makeHrInOptionsMenu(i,1)
	}
}


function makeHrInOptionsMenu(hour,spec) {
	//creates the menu item in the array of menu items - contains the specs
	//get the menu template from specs
	var menuItemId
	var optionsMenuIndex = 0
	var thisMenuSpec = menuItemsSpecs[spec]
	
	//make new menuItem
	var theMenuItem = thisMenuSpec[1].slice(0)
	
	//the id is the hour
	menuItemId = hour
	
	//make drawing array and save
	drawTmpl =  theMenuItem[0]
   drawing = makeDrawingArray(drawTmpl,1,1,'ctx2');
   modToZero2(drawing,'ctx2')
   modToNew2(drawing,0,30,'ctx2')
   theMenuItem[2] = drawing
   theMenuItem[3] = thisMenuSpec[4] //fill clr
	
	//customise the theMenu Item 
	theMenuItem[1] = menuItemId //the id used to find this meneu item	
	
	//theMenuItem[9] = thisMenuSpec[4] //fill clr
	theMenuItem[14] = thisMenuSpec[5] //moon or sun
	theMenuItem[15] = thisMenuSpec[6] //fill color
	theMenuItem[16] = thisMenuSpec[7] //flame or not
	theMenuItem[17] = thisMenuSpec[9] //17 is the actual colour of drop
	theMenuItem[19] = thisMenuSpec[8] //19 is the on colour
	theMenuItem[20] = thisMenuSpec[9] //20 is the off colour
	theMenuItem[23] = hour
	theMenuItem[18] = false
		
	//save in optionsMenu
	//optionsMenu[optionsMenuIndex] = theMenuItem
	optionsMenu[menuItemId] = theMenuItem

}


function construct24hGui(p24h) {	

	const sunR = parseInt(p24h[0].toFixed())
	const sunS = parseInt(p24h[1].toFixed())
	
	//delete the children of the hours24a element
	while (hours24a.hasChildNodes()) {  
  		hours24a.removeChild(hours24a.firstChild);
	}
	//now the hours24a has no children - no more cavases 24hr
	
	//from 0 to before sunrise
	for (let i = 0; i < sunR; i++) {
  		makeHrGui(i,1)
	}
	//day time - sun rise to sun set
	
	for (let i = sunR; i <= sunS; i++) {
  		makeHrGui(i,1)
	}
	//sunset to 24
	for (let i = sunS+1; i < 24; i++) {
  		makeHrGui(i,1)
	}
}


function makeHrGui(hour,z) {
	
	var theMenuItem = optionsMenu[hour]
	//create new canvas
	var htmlString = '<canvas id='+hour+' width="80" height="200"></canvas>'
	
	if (hour == 0) {
		//it is the first item - the first canvas to be created
		hours24a.insertAdjacentHTML('afterbegin', htmlString);			
	}else{
		//it is not the first item - use the ID of the previous one
		entryPoint = document.getElementById(hour-1);
		entryPoint.insertAdjacentHTML('afterend', htmlString);
	}	
	
	//draw the hour details
   var menuOp = document.getElementById(hour);
     
  	//draw the menu item on its canvas
  	var menuCtx = document.getElementById(hour).getContext("2d");
	drawPzzl(theMenuItem,false,false,menuCtx,2)
	//draw the sun on first canvas
	drawPzzl(theMenuItem,false,false,menuCtx,14)
	
	//menuOp.addEventListener('touchstart',h24Start)//,{passive: true})
	//menuOp.addEventListener('touchmove',h24Swipe)//,{passive: true})
	//menuOp.addEventListener('touchend',flameHandler)//,{passive: true})
	
	//draw second square on canvas
	modToZero2(drawing,'ctx2')
	modToNew2(drawing,0,90,'ctx2')
	theMenuItem[2] = drawing
	drawPzzl(theMenuItem,false,false,menuCtx,2)
	
	drawPzzl(theMenuItem,false,false,menuCtx,16)
	
	//add the text : t,txtX,txtY,fill,theCtx
	addPuzTxt(theMenuItem[23],theMenuItem[25],theMenuItem[26],theMenuItem[24],menuCtx);

}

function makeHour(hour,spec) {
	
	//this does  2 things 
	//1 - creates the menu item in the array of menu items - contains the specs
	//2 - creates a canvas in the array of 24hour canvases
	
	//get the menu template from specs
	var menuItemId
	var optionsMenuIndex = 0
	var thisMenuSpec = menuItemsSpecs[spec]
	
	//make new menuItem
	var theMenuItem = thisMenuSpec[1].slice(0)
	
/*	//determine the id
	if (optionsMenu.length == 0) {
		//the options menu length is 0
		menuItemId = 0;
	}else {
		//there are already items in options menu
		//make the new id last plus 1
		prevMenuId = optionsMenu[optionsMenu.length-1][1]
		menuItemId = parseInt(prevMenuId)+1
		optionsMenuIndex = optionsMenu.length
	}*/
	
	//the id is the hour
	menuItemId = hour
	
	//customise the theMenu Item 
	theMenuItem[1] = menuItemId //the id used to find this meneu item	
	theMenuItem[9] = thisMenuSpec[4] //fill clr
	theMenuItem[14] = thisMenuSpec[5] //moon or sun
	theMenuItem[15] = thisMenuSpec[6] //fill color
	theMenuItem[16] = thisMenuSpec[7] //flame or not
	theMenuItem[17] = thisMenuSpec[8] //fill color
	theMenuItem[23] = hour
		
	//save in optionsMenu
	//optionsMenu[optionsMenuIndex] = theMenuItem
	optionsMenu[menuItemId] = theMenuItem
		
	//create new canvas
	//if first menu item (the list.length is 1) use default insert point
	var htmlString = '<canvas id='+menuItemId+' width="80" height="200"></canvas>'
	
	
	//if (optionsMenu.length == 1) {
	if (hour == 0) {
		//it is the first menu item - the first canvas to be created
		hours24a.insertAdjacentHTML('afterbegin', htmlString);			
	}else{
		//it is not the first menu item - use the ID of the previous one
		entryPoint = document.getElementById(hour-1);
		entryPoint.insertAdjacentHTML('afterend', htmlString);
	}	
	
	//draw the hour details
   var menuOp = document.getElementById(menuItemId);
   //make drawing array from template - use the template name in spec
   drawTmpl =  thisMenuSpec[2]
   drawing = makeDrawingArray(drawTmpl,1,1,'ctx2');
   modToZero2(drawing,'ctx2')
   modToNew2(drawing,0,30,'ctx2')
   theMenuItem[2] = drawing
   theMenuItem[3] = thisMenuSpec[4]//fill color
  	//draw the menu item on its canvas
  	var menuCtx = document.getElementById(menuItemId).getContext("2d");
	drawPzzl(theMenuItem,false,false,menuCtx,2)
	//draw the sun on first canvas
	drawPzzl(theMenuItem,false,false,menuCtx,14)
	
	//menuOp.addEventListener('touchstart',h24Start)//,{passive: true})
	//menuOp.addEventListener('touchmove',h24Swipe)//,{passive: true})
	//menuOp.addEventListener('touchend',flameHandler)//,{passive: true})
	
	//draw second square on canvas
	modToZero2(drawing,'ctx2')
	modToNew2(drawing,0,90,'ctx2')
	theMenuItem[2] = drawing
	drawPzzl(theMenuItem,false,false,menuCtx,2)
	drawPzzl(theMenuItem,false,false,menuCtx,16)
	
	//add the text : t,txtX,txtY,fill,theCtx
	addPuzTxt(theMenuItem[23],theMenuItem[25],theMenuItem[26],theMenuItem[24],menuCtx);		
	
}

function drawPzzl(specs,useHighlightClr,savePzl,theCtx,drawingIndex) {
	
	const newDrawing = specs[drawingIndex]
	const fClr = specs[drawingIndex+1]
	
	//test convert color to hex
	//fClr = rgbToHex(specs[drawingIndex+1])
	
// #path1705
	theCtx.beginPath();
	theCtx.fillStyle = fClr; //'rgb(255, 255, 0)'
	
	theCtx.lineWidth = 0.417316;
	theCtx.lineCap = 'butt';
	theCtx.lineJoin = 'miter';
	theCtx.miterLimit = 4;
	
	//this is painting the puzzel onto the canvas
	for (let i = 0; i < newDrawing.length; i++) {	
		if (newDrawing[i][0]=='ctx2.moveTo') {
			theCtx.moveTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx2.lineTo') {
			theCtx.lineTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx2.bezierCurveTo') {
			theCtx.bezierCurveTo(newDrawing[i][1],newDrawing[i][2],newDrawing[i][3],newDrawing[i][4],newDrawing[i][5],newDrawing[i][6]);
		}
	};	
	theCtx.fill();
	theCtx.stroke();

};


function drawOnCanvas(drawing,x,y,fClr,sClr,theCtx) {
	
	const newDrawing = drawing
		
// #path1705
	theCtx.beginPath();
	theCtx.fillStyle = fClr; //'rgb(255, 255, 0)'
	
	theCtx.lineWidth = 0.417316;
	theCtx.lineCap = 'butt';
	theCtx.lineJoin = 'miter';
	theCtx.miterLimit = 4;
	
	//this is painting the puzzel onto the canvas
	for (let i = 0; i < newDrawing.length; i++) {	
		if (newDrawing[i][0] == 'ctx.moveTo') {
			theCtx.moveTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0] == 'ctx.lineTo') {
			theCtx.lineTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0] == 'ctx.bezierCurveTo') {
			theCtx.bezierCurveTo(newDrawing[i][1],newDrawing[i][2],newDrawing[i][3],newDrawing[i][4],newDrawing[i][5],newDrawing[i][6]);
		}
	};	
	theCtx.fill();
	theCtx.stroke();

};

function pzOptionHandler(theOption) {	
	console.log('at pzOption handler'+theOption.currentTarget.id)
	//set as selected option to draw on main canvas
	//find the menuItem in menuItems array by ID
	const menuOptionsIndex = findMenuItem(theOption.currentTarget.id)
	selectedPuzzel =  optionsMenu[menuOptionsIndex]	
};

function findMenuItem(id) {
	menuItemIndex = 'none'
	for (let i = 0; i < optionsMenu.length; i++){
		//look for id
		if (optionsMenu[i][1] == id) {
			//the id is a match
			menuItemIndex=i
			break
		}
	}	
	return menuItemIndex
};

function addPuzTxt(t,txtX,txtY,fill,theCtx) {	
// #text43239
	theCtx.fillStyle = fill;
	theCtx.lineWidth = 0.446741;
	theCtx.font = "normal normal 24px sans-serif";
	theCtx.fillText(t, txtX, txtY);

};

function h24Swipe() {
	//if move then dont change flame status
	h24Move = true;
	}
	
function h24Start() {
	//if move then dont change flame status
	h24Move = false;
	}
	
function flameHandler(theOption) {
	//descriminate between activities
	if (activityId == 'make_schedule_template') {
		//the current actiity is make_schedule_te
	if (h24Move == false) {
		//no move
	console.log('at pzOption handler'+theOption.currentTarget.id)
	//set as selected option to draw on main canvas
	//find the menuItem in menuItems array by ID
	const menuOptionsIndex = findMenuItem(theOption.currentTarget.id)
	selectedHour =  optionsMenu[menuOptionsIndex]
	var menuCtx = document.getElementById(selectedHour[1]).getContext("2d");
	var thisDay = parseInt(selectedDay)-100
	if (selectedHour[18]) {
		//the flame is on - turn off
		selectedHour[18] = false;
		selectedHour[17] = 'rgb(81, 82, 81)';
		//update the GUI
		drawPzzl(selectedHour,false,false,menuCtx,16)
		
		//update the user template dataBase	
		//y2022[0][thisDay][menuOptionsIndex] = [false]
		//userTemplates[] // ([theName,[]])
		
		}else{
		//the flame is off - turn on
		selectedHour[18] = true;
		selectedHour[17] = 'rgb(255, 0, 0)';
		//update the GUI
		drawPzzl(selectedHour,false,false,menuCtx,16)
		
		//update the user template dataBase
		//userTemplates[0][thisDay][menuOptionsIndex] = [true]
		}
	}
}else if (activityId == '') {
	//the current activity is edit schedule
	if (h24Move == false) {
		//no move
	console.log('at pzOption handler'+theOption.currentTarget.id)
	//set as selected option to draw on main canvas
	//find the menuItem in menuItems array by ID
	const menuOptionsIndex = findMenuItem(theOption.currentTarget.id)
	selectedHour =  optionsMenu[menuOptionsIndex]
	var menuCtx = document.getElementById(selectedHour[1]).getContext("2d");
	var thisDay = parseInt(selectedDay)-100
	if (selectedHour[18]) {
		//the flame is on - turn off
		selectedHour[18] = false;
		selectedHour[17] = 'rgb(81, 82, 81)';
		//update the GUI
		drawPzzl(selectedHour,false,false,menuCtx,16)
		//update the year dataBase	
		y2022[0][thisDay][menuOptionsIndex] = [false]
		}else{
		//the flame is off - turn on
		selectedHour[18] = true;
		selectedHour[17] = 'rgb(255, 0, 0)';
		//update the GUI
		drawPzzl(selectedHour,false,false,menuCtx,16)
		y2022[0][thisDay][menuOptionsIndex] = [true]
		}
	}
}
};


