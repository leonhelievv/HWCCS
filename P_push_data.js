function initPushData(deviceInPush) {
	if (deviceInPush == false) {
	activePlay = 'P_push_data'
	playHeader1.innerHTML = 'Please wait !, sending user settings to the HWCCS'
	//show the loading spinner while waiting
	waitingFor1.style.display = 'block'
	
	//say what is the waiting for
	waitFor1.innerHTML = 'Sending user schedules to HWCCS'
	
	//mute the home btn
	goHomeBtn1.style.display = 'none';
	
	//set appMode to PushData
	appMode = 'waitPushData'
	
	//put device in push mode
	bleTransmit("pushData");
  	setTimeout(getResponse,500);
  	
	}else {
	//device is in push continue
	//prepare the data for sending
	prepareData();
	//start the push process
	HWCCSclear = false
	pushDataState[0] = 'none'
	pushDataState[1] = 0
	sendHWCData()
	}

}

function cleanUpPushData() {
	waitingFor1.style.display = 'none'
	bleTransmit("deployPushData");
	bleTransmit("runHWCCS");
	initHomeDisplay()

}

function prepareData(){
	
	schToHWCD = []
	asgnToHWCD = []
	offAllToHWCD = []

	const noSch = userTemplates.length
	//const noValp = userTemplates[0][1].length
	
	//make long string of sch separated by bar
	
	//sch|1:6/testName/0,4,6,8,10,13,20,70,|2:6/noName/6,9,12,14,18,20,21,65,|3:6/noName/	300,2,3,4,5,6,7,8,
	
	var schString = ""
	for (i = 0; i < noSch; i++) {
		var noValp = userTemplates[i][1].length
		var theName = userTemplates[i][0]
		schString = schString+(i+1)+":"+noSch+"/"+theName+":"
		//do for no of value pairs
		for (ivp = 0; ivp < noValp; ivp++) {
			v1 = userTemplates[i][1][ivp][0]
			v2 = userTemplates[i][1][ivp][1]
			//do not if v1 or v2 = -1
			schString = schString+v1+","+v2+","
		}
		//put the tempratures in the sch string
		t1 = userTemplates[i][2][0]
		t2 = userTemplates[i][2][1]		
		schString = schString + '/'+t1+","+t2+"|"
	}
	console.log(schString)
	
	//brake up string in 36 charater segments
	const schSl = Math.ceil(schString.length/36)  
	var from = 0
	for (iN = 0; iN < schSl; iN++) {	
	
		//push into array the segments
		if (schSl-iN+1*36 < 36) {
			//the last segment is shorter that 36		
			schToHWCD.push(schString.substring(from))
		}else{
			schToHWCD.push(schString.substring(from,from+36))
			from = from + 36
		}
	}
	//add the data pack count
	var aL = schToHWCD.length
	for (i = 0; i < aL; i++) {
		var st = "sch/"+(i+1)+':'+aL+'/'+schToHWCD[i]
		schToHWCD[i] = st
	}
	
	//string the schAndAssingments
	var asgnString = ""
	const noAsgn = schAndAssingments.length
	
	for (i = 0; i < noAsgn; i++) {
		var theName = schAndAssingments[i][0]
		var v = schAndAssingments[i][1]
		var asgnString = asgnString+(i+1)+":"+noAsgn+"/"+theName+":"+v+"|"		
	}
	console.log(asgnString)
	
	//brake up asgn string in 36 charater segments
	const asgnSl = Math.ceil(asgnString.length/36)  
	var from = 0
	for (iN = 0; iN < asgnSl; iN++) {	
		//push into array the segments
		if (asgnSl-iN+1*36 < 36) {
			//the last segment is shorter that 36		
			asgnToHWCD.push(schString.substring(from))
		}else{
			asgnToHWCD.push(asgnString.substring(from,from+36))
			from = from + 36
		}
	}
	//add the data pack count
	var aL = asgnToHWCD.length
	for (i = 0; i < aL; i++) {
		var st = "asgn/"+(i+1)+':'+aL+'/'+asgnToHWCD[i]
		asgnToHWCD[i] = st
	}
	
	//string the offAllData
	var offAllString = "offAll/"
	const noOffAll = offAllData.length
	
	for (i = 0; i < noOffAll; i++) {
		var theName = offAllData[i][0]
		var v1 = offAllData[i][1]
		var v2 = offAllData[i][2]
		offAllString = offAllString+(i+1)+":"+noOffAll+"/"+theName+":"+v1+","+v2+"|"	
	}
	console.log(offAllString)
	
	//brake up offAll string in 36 charater segments
	const offAllSl = Math.ceil(offAllString.length/36)  
	var from = 0
	for (iN = 0; iN < offAllSl; iN++) {	
		//push into array the segments
		if (offAllSl-iN+1*36 < 36) {
			//the last segment is shorter that 36		
			offAllToHWCD.push(offAllString.substring(from))
		}else{
			offAllToHWCD.push(offAllString.substring(from,from+36))
			from = from + 36
		}
	}
	//add the data pack count
	var aL = offAllToHWCD.length
	for (i = 0; i < aL; i++) {
		var st = "offAll/"+(i+1)+':'+aL+'/'+offAllToHWCD[i]
		offAllToHWCD[i] = st
	}
	
}

function sendHWCData() {	
	//initiate comms by sending msg to get HWCCSclear
	bleTransmit('updateUd')
	//launche the pushDataLoop
   setTimeout(pushDataLoop,100);
}

function pushDataLoop() {
	//initiate read characteristic
	characteristicCache.readValue();
}

function doDataPush() {
	
	if (HWCCSclear == true || HWCCSclear == false) {
		//the charateristic is HWCCSclear
		
		//error quard back to 0
		pushDataState[3] = 0
		//get lengths
		const schL = schToHWCD.length
		const asgnL = asgnToHWCD.length
		const offAllL = offAllToHWCD.length
	
		if (pushDataState[0] == 'none') {
			//it is the start of push data to HWCCS
			pushDataState[0] = 'sch'
			pushDataState[1] = 0
			//send the first segment
			dataSegm = schToHWCD[pushDataState[1]]
			//HWCCSclear = false;
			bleTransmit(dataSegm)
			pushDataState[1] = pushDataState[1]+1
			//more is expected
			setTimeout(pushDataLoop,500);
		
		}else if (pushDataState[0] == 'sch') {
			if (pushDataState[1] < schL) {
				//all segments of data from sch array has not been sent
				dataSegm = schToHWCD[pushDataState[1]]
				//HWCCSclear = false;
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'asgn'
				pushDataState[1] = 0
				setTimeout(pushDataLoop,500);
			}
		
		}else if (pushDataState[0] == 'asgn'){
			waitFor1.innerHTML = 'Sending list of assigned sch to HWCCS'
			if (pushDataState[1] < asgnL) {
				//all segments of data from asgn array has not been sent
				dataSegm = asgnToHWCD[pushDataState[1]]
				//HWCCSclear = false;
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'offAll'
				pushDataState[1] = 0
				setTimeout(pushDataLoop,500);
			}
	
		}else if (pushDataState[0] == 'offAll'){
			waitFor1.innerHTML = 'Sending away days to HWCCS'
			if (pushDataState[1] < offAllL) {
				//all segments of data from asgn array has not been sent
				dataSegm = offAllToHWCD[pushDataState[1]];
				//HWCCSclear = false;
			
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'complete'
				pushDataState[1] = 0
				//ste appMode to normal
				appMode = 'normal'
				//send end of push data
				//bleTransmit('endPushData')
				cleanUpPushData()		
			}
	}
		
	}else {
		//the response from HWCCS is not clear
		//increment counter as guard - no forever loop
		pushDataState[2] = pushDataState[2]+1
		if (pushDataState[2] > 10) {
			pushDataState[3] = 'Error wait for HWCCSclear'
			//alert user - do some thing
		}else {
			//wait some more
			setTimeout(pushDataLoop,500);
		}
	}
}




function sendHWCData() {	
	//initiate comms by sending msg to get HWCCSclear
	bleTransmit('updateUd')
	//launche the pushDataLoop
   setTimeout(pushDataLoop,100);
}

function pushDataLoop() {
	//initiate read characteristic
	characteristicCache.readValue();
}

function doDataPush() {
	
	if (HWCCSclear == true || HWCCSclear == false) {
		//the charateristic is HWCCSclear
		
		//error quard back to 0
		pushDataState[3] = 0
		//get lengths
		const schL = schToHWCD.length
		const asgnL = asgnToHWCD.length
		const offAllL = offAllToHWCD.length
	
		if (pushDataState[0] == 'none') {
			//it is the start of push data to HWCCS
			pushDataState[0] = 'sch'
			pushDataState[1] = 0
			//send the first segment
			dataSegm = schToHWCD[pushDataState[1]]
			//HWCCSclear = false;
			bleTransmit(dataSegm)
			pushDataState[1] = pushDataState[1]+1
			//more is expected
			setTimeout(pushDataLoop,500);
		
		}else if (pushDataState[0] == 'sch') {
			if (pushDataState[1] < schL) {
				//all segments of data from sch array has not been sent
				dataSegm = schToHWCD[pushDataState[1]]
				//HWCCSclear = false;
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'asgn'
				pushDataState[1] = 0
				setTimeout(pushDataLoop,500);
			}
		
		}else if (pushDataState[0] == 'asgn'){
			waitFor1.innerHTML = 'Sending list of assigned sch to HWCCS'
			if (pushDataState[1] < asgnL) {
				//all segments of data from asgn array has not been sent
				dataSegm = asgnToHWCD[pushDataState[1]]
				//HWCCSclear = false;
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'offAll'
				pushDataState[1] = 0
				setTimeout(pushDataLoop,500);
			}
	
		}else if (pushDataState[0] == 'offAll'){
			waitFor1.innerHTML = 'Sending away days to HWCCS'
			if (pushDataState[1] < offAllL) {
				//all segments of data from asgn array has not been sent
				dataSegm = offAllToHWCD[pushDataState[1]];
				//HWCCSclear = false;
			
				bleTransmit(dataSegm)
				pushDataState[1] = pushDataState[1]+1
				//more is expected
				setTimeout(pushDataLoop,500);
			}else {
				//all segments has been sent
				pushDataState[0] = 'complete'
				pushDataState[1] = 0
				//ste appMode to normal
				appMode = 'normal'
				//send end of push data
				//bleTransmit('endPushData')
				cleanUpPushData()		
			}
	}
		
	}else {
		//the response from HWCCS is not clear
		//increment counter as guard - no forever loop
		pushDataState[2] = pushDataState[2]+1
		if (pushDataState[2] > 10) {
			pushDataState[3] = 'Error wait for HWCCSclear'
			//alert user - do some thing
		}else {
			//wait some more
			setTimeout(pushDataLoop,500);
		}
	}
}

function push_data_msgHandler(msg) {
	
	if (msg == 'HWCCSclear') {
   	//the read string is "HWCCSclear" - ready to receive user data update
   	//raise flag
   	HWCCSclear = true  
   	doDataPush()	
	} else if (msg == "inPushData") {
		//it is a confirm that device is in pushMode
		//continue init push data
		initPushData(true)
	}else if (msg == "pushData") {
		//still waiting for confirmation - wait
		setTimeout(getResponse,200);
	}else {
		//it could be a data segment
		doDataPush()	
	}
		
}

/*	if (pushDataMode == 'pushData') {
		//app is not in push data to HHWCCS mode
		doDataPush()
		
	}else if (pushDataMode == 'waitPushData'){
		//app is waiting for a confirm from HWCCS
		
	}*/