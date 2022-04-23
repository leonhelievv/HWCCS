const service_uuid = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
const characteristic_uuid_RX = "beb5483e-36e1-4688-b7f5-ea07361b26a8"
const characteristic_uuid_TX = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Characteristic object cache
let characteristicCache = null;
// Selected device object cache
let deviceCache = null;
let lemoDevice = null;
//respons check flag
let responsCheckFlag = false;
//waiting on respons flag
let awaitRespons = false;

let nowRespons = 'none';

//Resolve 
let awaitTxResolve = false;
let awaitReadResolve = false;

//lemo cmnd
let appCmndToHWCSFlag = false;
let newAppCmnd = 'none';

let txMitterFree = true;
// Get references to UI elements


function BLE_setup() {
	//alert("at BLE setUp")
	connect().then(function() {
  		console.log("device is connected");
  		//ends the P_BLE_coms play - call cleanup
  		cleanupBLEComs()	
	});
};

// Launch Bluetooth device chooser and connect to the selected
function connect() {
	return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      catch(error => console.log('connect Error !! '+error))    
}

//do disconnect when lemo window close ??? - i think it is automatic
function disconnect() {
  if (deviceCache) {
  	//there is a HWCS
   if (deviceCache.gatt.connected) {
    //the HWCS is connected
    //console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
    deviceCache.removeEventListener('gattserverdisconnected',handleDisconnection);
    deviceCache.gatt.disconnect();
    console.log(deviceCache.name + '"HWCS disconnected');
    deviceCache = null;
    }
    else {
      console.log('"' + deviceCache.name +'" HWCS is already disconnected');
    }
  } else {
  	console.log('nothing to disconnect');
  }
}

var busyReceivingData = false;

function getHWCSData(section) {
	result = ""
	//this function sends the command 'sendData'
	//can the command be sent
	if (busyReceivingData == false) {
		//not busy receiving data
		//send the command
		busyReceivingData = true
		result = bleTransmit("sendData"+section);
		if (result == 'done') {
			//the request was sent
			currentCmnd = 'sendData'+section
			//set the clock to read the characteristic
			setTimeout(getResponse,500);
		}
	}else {
		//busy receiving data
		//report failed to do
		console.log("get data failed because still busy receiving")
		result = "error/busyReceiving"
	}
	//and controls the receipt of the data
	return result
};

function getResponse() {
	console.log('get respons timer fired - get the response - wait for read');
	txMitterFree = false;
	characteristicCache.readValue();
};

function resultFromRead(event) {
	txMitterFree = true;
/* This function will be called when readValue resolves and
 * characteristic value changes since characteristicvaluechanged event
 * listener has been added. */
	
	//console.log('read or tx resolved ----');
  var theLength = event.currentTarget.value.byteLength;
  var readString = '';
 
	for (let i = 0; i < theLength; i++) {
  		var theValue = event.target.value.getUint8(i);
  		readString = readString + String.fromCharCode(theValue)
	}
	console.log('value Read >> '+readString);
	
	//pass the result to the active play
	if (activePlay == 'P_push_data') {
		//this respons is for P_push_data
		push_data_msgHandler(readString)
		
	}else if (activePlay == 'P_get_data') {
		//this response is for P_get_data
		get_data_msgHandler(readString)
		
	}else if (activePlay == 'P_overide') {
		//this respons is for the P_overide play
		overide_msgHandler(readString)
	}else if (activePlay == 'P_set_HWCCS_clock') {
		//this respons is for the P_set_HWCCS_clock
		setClock_msgHandler(readString)
	}else if (activePlay == 'Home_Display') {
		//this respons is for the home
		home_msgHandler(readString)
	}
};

function bleTransmit_original(toSend) {
	result = "done"
	//test if HWCS is and if connected
	if (deviceCache) {
  	//there is a HWCS
   	if (deviceCache.gatt.connected) {
    		//the HWCS is connected
      	let buffer = new ArrayBuffer(toSend.length);
      	let dataView = new DataView(buffer);
      	for (var i = 0; i <toSend.length; i++) {
        		dataView.setUint8( i, toSend.charAt(i).charCodeAt() );
      	}
			if (txMitterFree == true){
      		console.log('accessing the device to send: '+toSend);
      		txMitterFree = false;
      		//awaitTxResolve = true;
      		//return characteristicCache.writeValue(buffer)//.then(function() {
      		characteristicCache.writeValue(buffer).then(function() {
  					console.log("after done make transmitter flag free true");
  					txMitterFree = true;		
				}).catch(error => {
					console.log("characteristicCache.writeValue - ERROR  "+error)
					//NetworkError: GATT operation already in progress.
					result = "error/GATTBusy"					
				})
			}else {
				console.log('error txMitter is not free');
				result = "error/txMitterNotFree"
			}
      }else{
      	//the HWCS is not connected
      	console.log('the HWCS is not connected');
      	result = "error/HWCCSnotConnected"
      }
   }else{
   	console.log('cant send - no HWCS')
   	result = "error/noDevice"
   }
   
   return result
 };
 


function bleTransmit(toSend) {
	result = "done"
	//test if HWCS is and if connected
	if (HWCCS_Server) {
  	//there is a HWCS
   	if (HWCCS_Server.device.gatt.connected) {
    		//the HWCS is connected
      	let buffer = new ArrayBuffer(toSend.length);
      	let dataView = new DataView(buffer);
      	for (var i = 0; i <toSend.length; i++) {
        		dataView.setUint8( i, toSend.charAt(i).charCodeAt() );
      	}
			if (txMitterFree == true){
      		console.log('accessing the device to send: '+toSend);
      		txMitterFree = false;
      		//awaitTxResolve = true;
      		//return characteristicCache.writeValue(buffer)//.then(function() {
      		characteristicCache.writeValue(buffer).then(function() {
  					console.log("after done make transmitter flag free true");
  					txMitterFree = true;		
				}).catch(error => {
					console.log("characteristicCache.writeValue - ERROR  "+error)
					//NetworkError: GATT operation already in progress.
					result = "error/GATTBusy"					
				})
			}else {
				console.log('error txMitter is not free');
				result = "error/txMitterNotFree"
			}
      }else{
      	//the HWCS is not connected
      	console.log('the HWCS is not connected');
      	result = "error/HWCCSnotConnected"
      }
   }else{
   	console.log('cant send - no HWCS')
   	result = "error/noDevice"
   }
   
   return result
 };


		
async function onWatchAdvertisementsButtonClick1() {
  try {
    console.log('Requesting any Bluetooth device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true});

    console.log('> Requested ' + device.name);

    device.addEventListener('advertisementreceived', (event) => {
      console.log('Advertisement received.');
      console.log('  Device Name: ' + event.device.name);
      console.log('  Device ID: ' + event.device.id);
      console.log('  RSSI: ' + event.rssi);
      console.log('  TX Power: ' + event.txPower);
      console.log('  UUIDs: ' + event.uuids);
      event.manufacturerData.forEach((valueDataView, key) => {
        logDataView('Manufacturer', key, valueDataView);
        
      });
      event.serviceData.forEach((valueDataView, key) => {
        logDataView('Service', key, valueDataView);
      });
    });
    
    console.log('Watching advertisements from "' + device.name + '"...');
    await device.watchAdvertisements();
    BLE_setup()
  } catch(error) {
    console.log('Argh! ' + error);
  }
}


const logDataView = (labelOfDataSource, key, valueDataView) => {
  const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join(' ');
  const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(valueDataView.buffer);
  console.log(`  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);
};


 
function requestBluetoothDevice() {
  console.log('Requesting bluetooth device...');
  
  return navigator.bluetooth.requestDevice({  
   filters: [{services: [service_uuid]}],
   //acceptAllDevices: true
  }).
      then(device => {
        console.log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;
        // Added line
        deviceCache.addEventListener('gattserverdisconnected',handleDisconnection);
        return deviceCache;
      });
}


function handleDisconnection(event) {
  let device = event.target;
  console.log('"' + device.name +'" bluetooth device disconnected, trying to reconnect...');
  //what does this do ???
  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => console.log(error));
} 
 
// Connect to the device specified, get service and characteristic
function connectDeviceAndCacheCharacteristic(device) {
	
	if (device.gatt.connected && characteristicCache) {
  	//there is a client connected and there is a characteristicCache
    	return Promise.resolve(characteristicCache);
 	}

  console.log('try to Connecting to GATT server...')
  return device.gatt.connect().
      then(server => {
        console.log('GATT server connected, getting service...');
        //return server.getPrimaryService(service2_uuid);
        return server.getPrimaryService(service_uuid);
      }).
      then(service => {
        console.log('Service found, getting characteristic...');
        //const Characteristic = service.getCharacteristic(characteristic2_uuid);
        const Characteristic = service.getCharacteristic(characteristic_uuid_RX);
        return Characteristic
      }).
      then(characteristic => {
        console.log('Characteristic found');
        characteristicCache = characteristic;
        //set event handler
        characteristicCache.addEventListener('characteristicvaluechanged',resultFromRead);       
        //characteristicCache.addEventListener('characteristicvaluechanged',valueChanged);       
        return characteristicCache;
      });
};

// Enable the characteristic changes notification
function startNotifications(characteristic) {
  console.log('Starting notifications...');

  return characteristic.startNotifications().
      then(() => {
        console.log('Notifications started');
      });
}


function valueChanged(event) {
	console.log('value changed >> ');
}


function responsCheckTime() {
	console.log('poling timer fired - check for response - wait for read');
	if (awaitRespons != true) {
		//await response is not true
	responsCheckFlag = true;
	characteristicCache.readValue();
//	characteristicCache.readValue().then(function(dataView) { 
//   console.log('responsCheckTime - is this after read resolve ?');
// })
	}
};

function sendUpdateToHWC() {
	//bleTransmit(????);
	//send schToHWCD ,asgnToHWCD, offAllToHWCD
	const schL = schToHWCD.length
	const asgL = asgnToHWCD.length
	const offAllL = offAllToHWCD.length
	
	
	
}
	
	
