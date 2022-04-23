//set the HWCCS date and time

function initSetClock() {
	activePlay = 'P_set_HWCCS_clock'
	setClockArea1.style.display = 'block'
	
	//display the home btn
	goHomeBtn1.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupSetClock)
	//define action for submit button
	setClockSubmit1.addEventListener('touchstart',pushClock)
	//get the date and time of the HWCCS
	bleTransmit("sendClock");
  	setTimeout(getResponse,500);
}

function cleanupSetClock() {
	
	setClockArea1.style.display = 'none'
	initHomeDisplay()
}


function pushClock() {
	//bleTransmit()
	date = setCalendar1.value
	time = setTime1.value
	bleTransmit('setClk/'+date+'|'+time)
	console.log('the date and time pushed to HWCCS is '+date+'|'+time)
	//wait confirmation setClock was done
	setTimeout(getResponse,1000);
	

}

function setClock_msgHandler(msg) {
	
	if (msg == 'HWCCSclear') {
		//???
 
	} else if (msg.includes("clock")) {
		//received the clock date and time from HWCCS - update GUI
		clock = msg.split('/');
		date = clock[1].split('-')
		if (date[1].length == 1) {
			//the date is single digit - put 0 in front
			date[1] = 0+date[1]
		}
		modDate = date[0]+'-'+date[1]+'-'+date[2]
		document.getElementById('setCalendar').value = modDate
		
		if (clock[2].length == 6) {
			//the time is 1 digit to many - delete it
			clock[2] = clock[2].slice(5,5)
		}
		document.getElementById('setTime').value = clock[2]

	}else if (msg == "sendClock") {
		//still waiting for confirmation - wait
		setTimeout(getResponse,200);
	}else if (msg == "setClkDone") {
		//pass play to Home_display
		cleanupSetClock()
	}
		
}