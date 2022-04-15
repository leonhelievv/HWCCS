function moveStart() {
	//record start position of touch
	var move = this.event
	event.preventDefault();
	startX = move.changedTouches[0].clientX
	startY = move.changedTouches[0].clientY
	console.log('touch x,y ' +startX+','+startY)
}

function calcMove() {
	//clac the new position of drop
	var move = this.event
	event.preventDefault();
	var newX = move.changedTouches[0].clientX
	var newY = move.changedTouches[0].clientY
	if (newX > startX) {
		//move forward
		if (cumulatedIncrement < dropMax) {
			//the max is not yet reached
			cumulatedIncrement = cumulatedIncrement + increment;
			var t = mapTemp(cumulatedIncrement,dropMin,dropMax,tempMin,tempMax)
			const newTempSet = t.toFixed(2);
			t = newTempSet+dgrC+'C';
			//reset the context to "normal"
			ctx.resetTransform();
			//ctx.translate(200, 200);	
			ctx.translate(225, 330);
			addText(t);
			rotateDrop();
			startX = newX

		}else {
			//the max has been reached
			console.log('max was reached');
		}	
	}else {
		//move backward
		if (cumulatedIncrement > dropStart) {
			//the minimum is not yet reached
			cumulatedIncrement = cumulatedIncrement - increment;
			var t = mapTemp(cumulatedIncrement,dropMin,dropMax,tempMin,tempMax)
			const newTempSet = t.toFixed(2);
			 t = newTempSet+dgrC+'C';
			 //reset the context to "normal"
			ctx.resetTransform();
			//ctx.translate(200, 200);
			ctx.translate(225, 330);
			addText(t);
			rotateBw();
			startX = newX

		}else {
			//the max has been reached
			console.log('max was reached');
		}	
		
	}	
};

function addText(text) {
	//clear the text square
	ctx.clearRect(-160, 150, 226, 70);
	//add the dial drop text
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.lineWidth = 0.070004;
	ctx.font = "normal normal 60px sans-serif";
	ctx.fillText(text, -150, 200);	
};

function rotateDrop() {
	//delete the current drop off the dial canvas	
	ctx.restore();
	//ctx.fillStyle = 'blueviolet';
	//ctx.fillStyle = "rgba(255, 255, 255, 1)";
	//ctx.clearRect(-190,-100, 290, 200);
	ctx.clearRect(-196,-70, 285, 175);
	//ctx.clearRect(29.601128, 540.940060, 278.753170, 179.226900);
	//ctx.fill();
	//ctx.stroke();
	//draw the drop in new position
	drawDrop(increment);
	ctx.save();
};

function rotateBw() {
	//t = newTempSet+dgrC+'C';
	//delete the current drop off the dial canvas
	ctx.restore();
	//ctx.fillStyle = 'rgb(255, 149, 0)';
	ctx.clearRect(-196,-70, 280, 175);
	//ctx.clearRect(29.601128, 540.940060, 278.753170, 179.226900);
	//ctx.fill();
	//ctx.stroke();
	//draw the drop in the previous position
	drawDrop(-Math.abs(increment))
	ctx.save();
};
        
function drawDrop(step) {
	ctx.rotate(Math.PI*step);
	//ctx.moveTo(0, 0);
	//ctx.bezierCurveTo(52, 2, 0, -100, 1, -106);
	//ctx.bezierCurveTo(1, -106, -59, 0, 0, 1);
	//ctx.fill();
	drawThings('Aqua','Aqua',ctx,theDropDrawing)
	//ctx.closePath();
};   

function mapTemp(num,in_min,in_max,out_min,out_max) {
	var r = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	return r
}
    
function drawThermostat(face) {
    	var sStyle = 'rgb(0, 202, 213)'	
    	const newX = 15
    	//const newY = -295
    	const newY = -320
  		//first make drawing array
  		newThing = makeDrawingArray(face,newX,newY,'ctx')
  		//draw the segment
  		drawThings(theFaceFill,sStyle,ctx,newThing)	
};

function drawThings(fClr,sStyle,theCtx,newDrawing) {
	theCtx.fillStyle = fClr; //'rgb(255, 255, 0)'
	theCtx.strokeStyle = sStyle;
	//this is painting the thing onto the canvas
	for (let i = 0; i < newDrawing.length; i++) {	
		if (newDrawing[i][0].includes('moveTo')) {
			theCtx.beginPath();
			theCtx.moveTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0].includes('lineTo')) {
			theCtx.lineTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0].includes('bezierCurveTo')) {			
			theCtx.bezierCurveTo(newDrawing[i][1],newDrawing[i][2],newDrawing[i][3],newDrawing[i][4],newDrawing[i][5],newDrawing[i][6]);
			
		}
	};
	theCtx.fill();
	theCtx.closePath();
	//ctx.stroke();
};

function makeDrawingArray(thing,newX,newY,ctxName) {
	
	var newDrawing=[]
	//A1 is an array of pzlCtx instructions 
	var A1 = thing.split(";")	
	//make 2d array
	var A2d = []	
	//loop through A1 and populate A2d
	for (let i = 0; i < A1.length; i++) {
		A2d[i]=A1[i].split(",")
		}

	var firstI
	//console.log('test 1 is an array the first part of the instruction')
	firstI = A2d[0][0].split("(")
	//console.log(A2d)
	
	for (let i = 0; i < A2d.length; i++) {

	if (A2d[i][0].includes(ctxName+'.moveTo') || A2d[i][0].includes(ctxName+'.lineTo')) {

//		console.log('test 1 is an array the first part of the instruction')
		var mlTo = A2d[i][0].split("(")
//		console.log(mlTo)

		//make an array of converted values of Instruction
		var newFirstI = [mlTo[0],parseInt(mlTo[1])+newX,parseInt(A2d[i][1])+newY]

		newDrawing.push(newFirstI)
//		console.log(newDrawing)

	}else if (A1[i].includes(ctxName+'.bezierCurveTo')) {
		//make an array of third instruction
		var newBzInstr = []
		//do the first part	
		//console.log('bzI is an array the first part of the bezier instruction')
		var bzI = A2d[i][0].split("(")
		//console.log(bzI)
		newBzInstr[0]=bzI[0]
		newBzInstr[1]=parseInt(bzI[1])+newX
		
		var px = false
		var aJust		
		for (let k = 1; k < A2d[i].length; k++) {
			if (px==true) {
				px=false
				aJust=newX
			}else{
				px=true
				aJust=newY
			}
			newBzInstr.push(parseInt(A2d[i][k])+aJust)
		}
		newDrawing.push(newBzInstr)
	}
}
//console.log('the new drawing instruction array ')
//console.log(newDrawing)
return newDrawing
};


function modToZero2(drawing,ctxName){
	const xMod = drawing[0][1]*-1
	const yMod = drawing[0][2]*-1
	const noMods = drawing.length
	if (drawing[0][0] = ctxName+'.moveTo') {
		//first is move
		//mod the moveTo
		drawing[0][1] = 0
		drawing[0][2] = 0
		//mod all others
		for (let ibc = 1; ibc < noMods; ibc++) {
			const l = drawing[ibc].length
  			//only for bezierCurve with 3 points
  			for (let i = 1; i < l; i=i+2) {
  				drawing[ibc][i] = drawing[ibc][i]+xMod
  				drawing[ibc][i+1] = drawing[ibc][i+1]+yMod
			}
		}	
	}else {
		//first is not move - error
	}
	return drawing
}


function modToNew(drawing,mX,mY){
	const noMods = drawing.length
	if (drawing[0][0] = 'ctx.moveTo') {
		//first is move
		//mod the moveTo
		drawing[0][1] = mX
		drawing[0][2] = mY
		//mod all others
		for (let ibc = 1; ibc < noMods; ibc++) {
  			//only for bezierCurve with 3 points
  			for (let i = 1; i <= 5; i=i+2) {
  				drawing[ibc][i] = drawing[ibc][i]+mX
  				drawing[ibc][i+1] = drawing[ibc][i+1]+mY
			}
		}	
	}else {
		//first is not move - error
	}
	return drawing
}

function modToNew2(drawing,mX,mY,ctxName){
	const noMods = drawing.length
	if (drawing[0][0] = ctxName+'.moveTo') {
		//first is move
		//mod the moveTo
		drawing[0][1] = mX
		drawing[0][2] = mY
		//mod all others
		for (let ibc = 1; ibc < noMods; ibc++) {
			const l = drawing[ibc].length
  			//only for bezierCurve with 3 points
  			for (let i = 1; i < l; i=i+2) {
  				drawing[ibc][i] = drawing[ibc][i]+mX
  				drawing[ibc][i+1] = drawing[ibc][i+1]+mY
			}
		}	
	}else {
		//first is not move - error
	}
}

function drawGrid(gap){
    ctx.beginPath();
    for(x=gap; x<canvasDial.width; x=x+gap){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasDial.height);
      }
     for(let y=gap; y<canvasDial.height; y=y+gap){
        ctx.moveTo(0, y);
        ctx.lineTo(canvasDial.height, y);
      }
      ctx.stroke();
      ctx.closePath();
};

function displayHWCTemp() {
	
	//------   draw the face of the thermostat
	drawThermostat(face);
	ctx.save();
	//move dial canvas to zero
	ctx.translate(230,320)

	//drtaw firtst drop at minimum
	theDropDrawing = makeDrawingArray(drop,0,0,'ctx')
	modToZero2(theDropDrawing,'ctx')
	modToNew(theDropDrawing,-190,-20)
	//addText('1'+dgrC+'C');
	drawThings('Aqua','Aqua',ctx,theDropDrawing)
	ctx.save();
	//the drop stands at minimum
	//calculate the increment size to the new temperature position
	
	const num =  parseInt(HWCData[0])//the temprature
	const in_min = 0
	const in_max = 80
	const out_min = 0
	const out_max = 1.4
	
	const increment = mapTemp(num,in_min,in_max,out_min,out_max)
	setTempDial(increment)
	
}


function updateTemp() {
	
	//------   draw the face of the thermostat
	//drawThermostat(face);
	//ctx.save();
	//move dial canvas to zero
	//ctx.translate(230,320)

	//drtaw firtst drop at minimum
	//theDropDrawing = makeDrawingArray(drop,0,0,'ctx')
	//modToZero2(theDropDrawing,'ctx')
	//modToNew(theDropDrawing,-190,-20)
	//addText('1'+dgrC+'C');
	//drawThings('Aqua','Aqua',ctx,theDropDrawing)
	//ctx.save();
	//the drop stands at minimum
	//calculate the increment size to the new temperature position
	
	const num =  parseInt(HWCData[0])//the temprature
	const in_min = 0
	const in_max = 80
	const out_min = 0
	const out_max = 1.4
	
	const increment = mapTemp(num,in_min,in_max,out_min,out_max)
	setTempDial(increment)
	
}

function dialListeners() {
	
	canvasDial1.addEventListener ('ontouchstart', moveStart)
	//canvasDial1.addEventListener('ontouchend',)
	cnavasDial1.addEventListener('ontouchmove',calcMove)
}

function setTempDial(increment) {
	//convert the temperature to the size of step that must be taken
	
	//update the cumulatedIncrement
	cumulatedIncrement = cumulatedIncrement + increment;
	
	//clear the dial_drop_canvas
	ctx.clearRect(-196,-70, 285, 175);
	
	//reset the context to "normal"
	ctx.resetTransform();
	ctx.translate(225, 330);
	t = HWCData[0]+dgrC+'C';
	addText(t);
	
	//step Size is clock Wise "+", anti clock wise "-", range 0.01 to 1.4
	drawDrop(increment)

};



 