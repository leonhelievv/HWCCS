//BLE comms play - only the BLE connection stuff - code is in BLE.js
var rdResponsInerval
var HWCSData = ''


function initBLEComs() {
	activePlay = 'P_BLE_coms'
	//fill the heading
	playHeader1.innerHTML = 'establish communication with hot water control system'
	playHeader1.style.display = 'block'	
	bleScanArea1.style.display = 'block'
	//assign event listener to scan btn
	//the event listener must be in the HTML code - direct user response
	//the successful connection ends this play and starts P_get_data play
}

function cleanupBLEComs() {
	
	//get the data from the HWCS - will only be available in the future
	HWCSDataAvailable = false;			
	playHeader1.style.display = 'none'
	bleScanArea1.style.display = 'none'
	bleScanBtn1.removeEventListener('touchstart',findHWCS)

	//the successful connection ends this play and starts P_get_data play
	initGetData()
}

async function findHWCS() {
	console.log('find my Hot water control system touch start event :'+event.currentTarget.id)
  try {
    console.log('Requesting any Bluetooth device...');
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true});
    console.log('> Requested ' + device.name);
    await device.watchAdvertisements;
    BLE_setup()
  } catch(error) {
    console.log('Argh! ' + error);
  }
}
