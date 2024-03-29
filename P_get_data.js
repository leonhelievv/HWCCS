var HWCSdataString = '';
let previousRespons = 'none';
var getSchDone = ''
var assignedDone = ''
var offAllDone = ''
var HWCDataDone = ''
var initGetDataP2 = false
var PgetData_commsFail = false
var PgetDataFailCount = 0

function initGetData() {
	if (initGetDataP2 == false) {
		//it is the first phase of init
		activePlay = 'P_get_data'
		//fill the heading
		playHeader1.innerHTML = 'get the data from the HWCCS'
		playHeader1.style.display = 'block'
		waitingFor1.style.display = 'block'
		//mute the home btn
		goHomeBtn1.style.display = 'none';
		//request the device to go to sendData mode
		bleTransmit("sendData");
  		setTimeout(getResponse,500);
  }else{
  	//it is the second phase of init
  	//setTimeout(doComms,1000);
	GetSchData()   
  }
}

function cleanupGetData(switchPlay) {
	if (!switchPlay) {
		//the device is not in RunHWCCS
		//first build the app data structures, use data from HWCS
		makeAppDataStructures()
		playHeader1.style.display = 'none'
		waitingFor1.style.display = 'none'
		initGetDataP2 = false
		bleTransmit("go/runHWCCS");
		//wait for convermation before passing play to HomeDisplay
		setTimeout(getResponse,500);
	}else {
		//the device is in RunHWCCS
		initHomeDisplay()
	}
}


function get_data_msgHandler(readString) {
	
   if (readString == currentCmnd) {
   	//the read string is still the current command - HWCS has not responded yet
   	//set the clock for another read later
   	random = Math.floor(Math.random() * 10)+1;
   	setTimeout(getResponse,100 * random);
   }else if (readString == 'subSetIn') {
   	//the read string is "subSetIn" - HWCS has not yet sent the next data segment
   	//set the clock for another read later
   	random = Math.floor(Math.random() * 10)+1;
   	setTimeout(getResponse,100 * random);
   }else if (readString == 'inSendData') {
   	//set the clock for continuaion of init
   	initGetDataP2 = true
   	random = Math.floor(Math.random() * 10)+1;
   	setTimeout(initGetData,100 * random);
   	console.log("got the respons - inSendData - continue with init")
   }else if (readString == 'sendData') {
   	//set the clock for continuaion of init  	
   	console.log("the read string is sendData - not cleared yet")
   	random = Math.floor(Math.random() * 10)+1;
   	setTimeout(getResponse,100 * random);
   }else if (readString == 'none') {
   	//??? what to do if readString is none
   	console.log('the read string is '+readString)  	
   	waitRespons = false
		//the requested command is fullfilled - no data			
		clearInterval(rdResponsInerval);				
		//no longer bussy receiving data
		busyReceivingData = false;
   	//allow some time before the resolve - avoid another immediate bleTransmit
   	setTimeout(doResolve("no_data"),1000);
   	
   }else if (readString == 'go/runHWCCS') {
   	//still waiting for device to confirm switch to play RunHWCCS
   	console.log('still waiting for device to confirm switch to play RunHWCCS '+readString)  	
   	setTimeout(getResponse,100 * random);  	
   }else if (readString == 'in/runHWCCS') {
   	//the device is in RunHWCCS - switch play to Home_Display
   	console.log('the device is in RunHWCCS - switch play to Home_Display '+readString)  	
   	cleanupGetData(true) 	
   }else if (readString == 'sendTemp') {
   	//this is an ERROR - should have been stopped in HomeCleanup
   	console.log('this is an ERROR - should have been stopped '+readString)  	
   		
   }else{
   	//it is a new segment of data to be handled
   	
   	//sch/0:8/1:6/Jesus/5,6,8,9,11,12,14,15,17,19
   	//sch/1:8/21,23,-1,-1,-1,-1;2:6/Lord/1,1,3,3,
   	
   	previousRespons = readString;
   		
   	var fs1i = readString.indexOf('/');
   	var fs2i = readString.indexOf('/',fs1i+1);
   	var cln1i = readString.indexOf(':',fs1i+1);
   	
   	var dataType = readString.substring(0,fs1i);
   	if (dataType == "sch" || dataType == "asgn" || dataType == "offAll" || dataType == "HWCInfo") {
   		//it is a valid data type
   		var payLoad = readString.substring(fs2i+1);
    		var nOfn = readString.substring(fs1i+1,fs2i);
    	
    		const nof = readString.substring(fs1i+1,cln1i);
    		const ofn = readString.substring(cln1i+1,fs2i);
    	
    		if (ofn == nof) {
    			//the 'nth' is the same as the full_number - it is the last one
    			//it is the last part of the string from HWCS
				HWCSdataString = HWCSdataString+payLoad
				console.log("at get_data_msgHandler string is "+HWCSdataString);
				//the full subset of data was received
				//set the characteristic to "cleared"
				//appCmndToHWCS('cleared')
				bleTransmit("allIn");
				awaitRespons = false
				//the requested command is fullfilled			
				clearInterval(rdResponsInerval);				
				//no longer bussy receiving data
				busyReceivingData = false;
				HWCSDataAvailable = true;
				
				//allow some time before the resolve - avoid another immediate bleTransmit
				console.log('allow some time before the resolve - avoid another immediate bleTransmit')
				setTimeout(doResolve("done"),1000);
							
    		}else if (nof == '1'){
    			//it is the first
    			HWCSdataString = payLoad
    			//there are more to come - set the clock to read again later
    			setTimeout(getResponse,500);
    			//respond with clear
    			bleTransmit("subSetIn");
    		}else {
    			//it is between first and last
    			HWCSdataString = HWCSdataString+payLoad
    			//there are more to come - set the clock to read again later
    			setTimeout(getResponse,500);
    			//respond with clear
    			bleTransmit("subSetIn");
    		}   	   	 
     		responsCheckFlag = false;
      	awaitRespons = false;	  
   	}
	}
}

function doResolve(detail) {
	//should i make the transmitter free here ?????
	txMitterFree = true;			
	//which resolve to call
	if (currentCmnd == 'sendDatasch') {
		//the resolve is for sch
		//schDone("The sch data from HWCS is now done !")
		schDone("sch_get/"+detail)
	}else if (currentCmnd == 'sendDataasgn') {
		//the resolve is for assigned
		//assignedDone("The assingned data from HWCS is now done !")
		assignedDone("asgn_get/+detail")
	}else if (currentCmnd == 'sendDataoffAll') {
		//the resolve is for offAll's
		//offAllDone("The offAll data from HWCS is now done !")
		offAllDone("offAll_get/"+detail)
	}else if (currentCmnd == 'sendDataHWCInfo') {
		//the resolve is for sendHWCInfo
		//HWCDataDone("The HWC data from HWCS is now done !")
		HWCDataDone("HWCCSInfo_get/"+detail)
	}
	currentCmnd = 'none'
}

async function  GetSchData() {
	
	let schDataHere = new Promise(function(resolve1) {
  		schDone = resolve1 
   	result = getHWCSData('sch')   
 	});

	schDataHere.then(
  		function(value) { 
  			console.log("get sch data done"+value)
  			//GetAssignedData()
  			getSchDone = 'done'
  			setTimeout(doComms,1000);
  			},
  		function(error) { console.log("get sch data ERROR") }
	);
	return result
}


async function  GetAssignedData() {
	//mute the ble scan area
	//bleScanArea1.style.display = 'none'
	//say what is the waiting for
	waitFor1.innerHTML = 'Waiting for assigned data from your HWCS'
 	
 	let assignedHere = new Promise(function(resolve2) {
  		assignedDone = resolve2  
   	result = getHWCSData('asgn')   
 	});
 	
 		assignedHere.then(
  		function(value) { 
  			console.log("get assigned data done"+value)
  			//GetOffAllData()
  			assignedDone = 'done'
  			setTimeout(doComms,1000);
  			},
  		function(error) { console.log("get asgn data ERROR") }
	);
 	 	
  //console.log('the task get assigned data is complete : '+await myPromise2) ;
  //GetOffAllData()
  return result
}

async function  GetOffAllData() {
	//mute the ble scan area
	bleScanArea1.style.display = 'none'
	//say what is the waiting for
	waitFor1.innerHTML = 'Waiting for offAll data from your HWCS'
 	
 	let offAllHere = new Promise(function(resolve3) {
  		offAllDone = resolve3  
   	result = getHWCSData('offAll')   
 	});
 	
 	 	offAllHere.then(
  		function(value) { 
  			console.log("get offAll data done"+value)
  			//cleanupBLEComs()
  			offAllDone = 'done'
  			setTimeout(doComms,1000);
  			},
  		function(error) { console.log("get offAll data ERROR") }
	);
	return result
}

async function  GetHWCData() {
	
	//say what is the waiting for
	waitFor1.innerHTML = 'Waiting for Hot Water cylinder data'
 	
 	let HWCDataHere = new Promise(function(resolve4) {
  		HWCDataDone = resolve4  
   	result = getHWCSData('HWCInfo')   
 	});
 	
 	 	HWCDataHere.then(
  		function(value) { 
  			console.log("GetHWCData done result is, "+value)
  			HWCDataDone = 'done'
  			setTimeout(doComms,1000);
  			},
  		function(error) { console.log("get HWC data ERROR") }
	);
	return result
}

 
function doComms() {
	if (getSchDone == 'done') {
		//the sch data is in
		schDataFromHWCS = HWCSdataString
		HWCSdataString = ''
		getSchDone = ''
		//random = Math.floor(Math.random() * 10)+1;
		//setTimeout(doComms,100 * random);
		GetAssignedData()
	}else if (assignedDone == 'done') {
		//the assigned data is in
		assignedDataFromHWCS = HWCSdataString
		HWCSdataString = ''
		assignedDone = ''
		//random = Math.floor(Math.random() * 10)+1;
		//setTimeout(doComms,100 * random);
		GetOffAllData()
	}else if (offAllDone == 'done') {
		//the offAll data is in
		offAllDataFromHWCS = HWCSdataString
		HWCSdataString = ''
		offAllDone = ''
		//random = Math.floor(Math.random() * 10)+1;
		//setTimeout(doComms,100 * random);
		GetHWCData()	
	}else if (HWCDataDone == 'done') {
		//the HWCCS info is in
		HWCSDataFromHWCS = HWCSdataString
		HWCSdataString = ''
		HWCDataDone = ''
		//cleanupBLEComs()
		cleanupGetData(false)
	}else {
		//still waitng for data
		setTimeout(doComms,1000);
	}
}
