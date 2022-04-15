//spot check day

const masks1 = document.getElementById('masks')
const maskReason1 = document.getElementById('maskReason')

function initSpotCheckDay() {
	activePlay = 'P_spot_check_this_day'
	playHeader1.innerHTML = 'Do a spot check for a specific day'
	//display the home btn
	goHomeBtn.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupSpotCheckDay)
	
	spotCheckDay1.style.display = 'block'
	spotCInput = document.getElementById('spotCheckInput')
	spotCInput.addEventListener('input',doSpotCheck)
}

function cleanupSpotCheckDay() {
	//mute all the spot check stuff
	spotCheckDay1.style.display = 'none'
	makeDaySchedule.style.display = 'none'
	hours24a.style.display = 'none'
	masks1.style.display = 'none'
	spotCInput.removeEventListener('onchange',doSpotCheck)
	initHomeDisplay()

}

function doSpotCheck() {
	//get the 24Hr array for the date
	const sCDate = event.currentTarget.value	
	const nDay = new Date(sCDate)
	//get the month index, and the day index
	const mI = nDay.getMonth()
	const dI = nDay.getDate()-1
	
	//change the schName - the Schedule for date
	theSchName1.innerHTML = 'The schedule for : '+sCDate
	
	if (optionsMenu.length == 0) {
 		//there is no 24_hour_optionsMenu		
 		construct24hOptions(p24h)
 	}
 	
 	//change the optionsMenu [18] 
 	//reset the optionsMenu to all off
 	//first reset the optionsMenu to all off
	for (o = 0; o < 24; o++) {
		optionsMenu[o][17] = 'rgb(81, 81, 81)'
		optionsMenu[o][18] = false
	}
	//get the 'on's' arrays applicable
	//interpret the schedules for this day and update flame data in optionsMenu
	const noArrays = y2022[mI][dI][1].length
	for (i = 0; i < noArrays; i++) {
		//for each of the ranges - update optionsMenu
		var startHr = y2022[mI][dI][1][i][0]
		var endHr = y2022[mI][dI][1][i][1]
		let dayMasked = false
		let isA4th = y2022[mI][dI].includes(y2022[mI][dI][4])
		if (isA4th == true) {
			//the 4th has a mask array
			if (y2022[mI][dI][4].length > 0) {
				//the 4th array has a mask
				dayMasked = true		
			}
		}
		//establish if day has a mask or masks - if [4] length is > 0	
		if (dayMasked == false) {
			//only if the day is not masked
			for (hr = startHr; hr <= endHr; hr++) {
					optionsMenu[hr][17] = 'rgb(255, 0, 0)'
					optionsMenu[hr][18] = true
				}
		}
	}
	//if y2022[m][d].includes a forth item
	const q = y2022[mI][dI].includes(y2022[mI][dI][4])
	//if there are 'all off masks' - change the options menu accordingly
	var maskList = []
	var  offAllsI = -1
	if (q == true) {
		//there are mask to apply
		const maskL = y2022[mI][dI][4].length
		//show all the masks
		for (i = 0; i < maskL; i++) {
			//make list of all masks in 26
			//index into offAllData
			var ri = y2022[mI][dI][4][i]
			let oadL = offAllData.length
			for (oad = 0; oad < oadL; oad++) {
				//loop through the offAllData array to find ri
				let offAllsI = offAllData[oad].indexOf(ri);
				if (offAllsI != -1) {				
					maskList.push(offAllData[oad])
					break
				}
			}
		}
		//show the mask that applies in GUI
		//make a card list of away days
		const awayCard = '<div id="maskContainer"></div>'
		//insert the card in ?????
		maskReason1.innerHTML = 'reasons why the flames are off: '+maskList
		masks1.style.display = 'block'
			
	}else {
		//no 'all off' masks for this day
		masks1.style.display = 'none'
	}

	//re construct GUI 24Hr schedule flames - and display
	construct24hGui(p24h)
 
 	//display the 24hr GUI
 	makeDaySchedule.style.display = 'block'
	hours24a.style.display = 'block'
	
}