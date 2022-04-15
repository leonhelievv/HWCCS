// main menu
var HWCDeviceConnected = true
var dialDone = false

function initHomeDisplay() {
	activityId = 'home'
	if (dialDone == false) {
	//draw temprature dial
	displayHWCTemp()
	dialDone = true
	}
	//format GUI
	activePlay = 'Home_Display'
	tmpDial.style.display = 'block';
	goHomeBtn1.style.display = 'none';
	playHeader1.style.display = 'block'
	makeSchBtn1.style.display = 'block';
	makeSchBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	makeSchBtn1.innerHTML = phaseHeaders[1];
	offAllBtn1.style.display = 'block'
	offAllBtn1.style.innerHTML = 'away from home - off'
	offAllBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	spotCheckDayBtn1.style.display = 'block'
	spotCheckDayBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	showSchAssigBtn1.style.display = 'block'
	showSchAssigBtn1.addEventListener('touchstart',cleanUpHomeDisplay)	
	getDataBtn1.style.display = 'block'
	getDataBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	setClockBtn1.style.display = 'block'
	setClockBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	overideBtn1.style.display = 'block'
	overideBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	
	//make user actions card column visible
	userActions1.style.display = 'block'	
	//this is conditional - is there a user schedule to show
	asgnUschWdBtnQ()
	//if there is a HWCD - show the update button
	if (HWCDeviceConnected == true) {
		//there is a HWCD connected
		updateHWCD1.style.display = 'block'
		updateHWCD1.addEventListener('touchstart',cleanUpHomeDisplay) //pushData
	}
	//display heading - make sample hot water schedule
	playHeader1.innerHTML = phaseHeaders[0]
	
	//get the temprature of the HWC
	bleTransmit("sendTemp");
  	setTimeout(getResponse,500);
  	//set timer to refresh the temprature
  	setTimeout(updateTmp,2000);
	
}

function cleanUpHomeDisplay() {
	const btn = event.currentTarget.id
	tmpDial.style.display = 'none'
	makeSchBtn1.style.display = 'none';
	
	mySchsBtn1.style.display = 'none'
	asgnUschWdBtn1.style.display = 'none'
	goHomeBtn.style.display = 'block';
	
	asgnUschWdBtn1.style.display = 'none'
	asgnUschWendBtn1.style.display = 'none'
	
	offAllBtn1.style.display = 'none'
	
	spotCheckDayBtn1.style.display = 'none'
	spotCheckDayBtn1.removeEventListener('touchstart',initSpotCheckDay)
	
	updateHWCD1.style.display = 'none'
	updateHWCD1.removeEventListener('touchstart',cleanUpHomeDisplay) //pushData
	
	showSchAssigBtn1.style.display = 'none'
	showSchAssigBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)	
	
	userActions1.style.display = 'none'
	//clear the getRespons timeout - in case this play is still waiting for a respons
	clearTimeout(getResponse)
	clearTimeout(updateTmp)
	
	//this is a change in play
	if (btn == 'makeSchBtn') {
		makeSchBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)
		initMakeSchedule()
	}else if (btn == 'mySchsBtn') {
		mySchsBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)
		initUserSch()
	}else if (btn == 'asgnUschWdBtn') {
		//the btn was asgnUschWdBtn1
		asgnUschWdBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)
		initAsgnUschWd()
	}else if (btn == 'asgnUschWendBtn') {
		//the btn was asgnUschWdBtn1
		asgnUschWendBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)
		initAsgnUschWend()
	}else if (btn == 'offAllBtn') {
		//the btn was off all
		offAllBtn1.removeEventListener('touchstart',cleanUpHomeDisplay)
		initOffall()
	}else if (btn == 'spotCheckDayBtn') {
		initSpotCheckDay()
		
	}else if (btn == 'showSchAssigBtn') {
		initshowSchAsigned()
		
	}else if (btn == 'updateHWCD') {
		initPushData(false)
	
	}else if (btn == 'getDataBtn') {
		initGetData()
		
	}else if (btn == 'setClockBtn') {
		initSetClock()
		
	}else if (btn == 'overideBtn') {
		initOveride()
	}
}

function asgnUschWdBtnQ() {
	if (userTemplates.length != 0) {
		//there is a userTemplate to show
	asgnUschWdBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	asgnUschWdBtn1.style.display = 'block'
	asgnUschWdBtn1.innerHTML =  phaseHeaders[4]
	
	asgnUschWendBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	asgnUschWendBtn1.style.display = 'block'
	asgnUschWendBtn1.innerHTML =  phaseHeaders[5]
	
	mySchsBtn1.style.display = 'block'
	mySchsBtn1.addEventListener('touchstart',cleanUpHomeDisplay)
	mySchsBtn1.innerHTML =  phaseHeaders[6]
	}
}

function home_msgHandler(msg) {
	
	if (msg.includes('temp')) {
		//extract the temprature
		tmp = msg.split('/');
		//update the temprature data 		
		HWCData[0] = parseInt(tmp[1])
		//update the temprature
		updateTemp()
 
	} else if (msg == "sendTemp") {
		//still waiting for confirmation - wait
		setTimeout(getResponse,200);
	}
		
}

function updateTmp() {
	//get the temprature of the HWC
	bleTransmit("sendTemp");
  	setTimeout(getResponse,500);
  	setTimeout(updateTmp,10000);
}


