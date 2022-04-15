

function initOveride() {
	activePlay = 'P_overide'
	//play header
	playHeader1.innerHTML='Overide the current schedule'
	overideArea1.style.display = 'block'
	//display the instructions
	onOffIfo1 = document.getElementById('onOffIfo')
	onOffIfo.innerHTML = 'Enter the date and time when the current schedule must resume.'
	//display the home btn
	goHomeBtn1.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupOveride)
	onOffBtn1 = document.getElementById('onOff');
	onOffBtn1.addEventListener('touchstart',onOffOveride)
	onOffSubmit1 = document.getElementById('onOffSubmit');
	onOffSubmit1.addEventListener('touchstart',overideSubmit)
	delOveride1 = document.getElementById('delOveride');
	delOveride.addEventListener('touchstart',overideDelete)
	//send request for flame state update
	bleTransmit('sendOveride')
	setTimeout(getResponse,500);
}


function cleanupOveride() {
	overideArea1.style.display = 'none'
	initHomeDisplay()
}

function onOffOveride() {
	//in response to the ON/OFF touch
	onOff1 = document.getElementById('onOff');
	onOffTxt = onOff1.innerHTML
	if (onOffTxt.includes('ON')) {
		onOff1.innerHTML = 'overide the system to : OFF'
		onOff1.style.color = 'green'
	}else {
		onOff1.innerHTML = 'overide the system to : ON'
		onOff1.style.color = 'red'
	}
}

function overideSubmit() {
	//in respons to the SUBMIT THIS OVERIDE touch
	overideState = 'ON'
	onOff1 = document.getElementById('onOff');
	onOffTxt = onOff1.innerHTML
	if (onOffTxt.includes('OFF')) {
		overideState = 'OFF'
	}
	v1 = document.getElementById('resumeDate').value;
	v2 = document.getElementById('resumeTime').value;
	if (v1 != "" && v2 != "") {
	//if valid date and time, send this schedule overide to device
	bleTransmit('pushOveride/'+overideState+'/'+v1+'/'+v2);
	setTimeout(getResponse,500);
	}
}


function overide_msgHandler(msg) {
	//"flameState/"+String(flameState);
	console.log('play is overide incomming msg is '+msg)
	onOff1 = document.getElementById('onOff');
	var c = document.getElementById('onOffCanvas');
	var ctx = c.getContext("2d");
	
	if(msg.includes('flameState')){
		//the msg type is flameState
		if (msg.includes('1')) {
			//flameState is ON - button shows the option to turn OFF
			onOff1.innerHTML = 'overide the system to : OFF'
			onOff1.style.color = 'green'			
			drawFlame('red')
		}else {
			//flameState is OFF - button show	bleTransmit('sendOveride')
			onOff1.innerHTML = 'overide the system to : ON'
			onOff1.style.color = 'red'			
			drawFlame('grey')
		}
			
	}else if (msg.includes('pushOveride')) {
		//still waiting for respons from HWCC flame state
		setTimeout(getResponse,500);
	}else if (msg.includes('sendOveride')) {
		//still waiting for respons from HWCC overide detail
		setTimeout(getResponse,500);
	}else if (msg.includes('deleteOveride')) {
		//still waiting for respons from HWCC overideDelete
		setTimeout(getResponse,500);
	} else if (msg.includes('HWCCSoveride')) {
		resumeDetail = msg.split("/")
		//the current overide in the HWCCS is in msg HWCCSoveride/onOrOff/date/time/flameState
		document.getElementById('resumeDate').value = resumeDetail[2]
		document.getElementById('resumeTime').value = resumeDetail[3]
		if (resumeDetail[4] == '1') {
			//flameState is ON - button shows the option to turn OFF
			onOff1.innerHTML = 'overide the system to : OFF'
			onOff1.style.color = 'green'			
			drawFlame('red')
		}else {
			//flameState is OFF - button shows the option to turn ON
			onOff1.innerHTML = 'overide the system to : ON'
			onOff1.style.color = 'red'			
			drawFlame('grey')
		}
	}
}


function drawFlame(fillClr) {
	var c = document.getElementById('onOffCanvas');
	var ctx = c.getContext("2d");
	//theFlame = makeDrawingArray(flame,-15,-80,'ctx2')
	theFlame = makeDrawingArray(flame2,0,0,'ctx')
	modToZero2(theFlame,'ctx')
	modToNew(theFlame,40,0)
	drawThings(fillClr,'red',ctx,theFlame)
}

function drawFlame2(fillClr,x,y) {
	var c = document.getElementById('canvasDial');
	var ctx = c.getContext("2d");
	theFlame = makeDrawingArray(flame2,-40,-160,'ctx')
	//modToZero2(theFlame,'ctx2')
	//modToNew(theFlame,-190,-20)
	drawThings(fillClr,'red',ctx,theFlame)
}



function overideDelete() {
	bleTransmit('deleteOveride')
	setTimeout(getResponse,500);
	
}

