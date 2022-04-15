//off schedules 

const awayLable = document.getElementById('awayL1')
const awayStart = document.getElementById('start1')
const awayEnd = document.getElementById('end1')
const offAllDel1 = document.getElementById('offAllDel')

function initOffall() {
	activePlay = 'P_off_all_these_days'
	//play header
	playHeader1.innerHTML='Away from home - no hot water required'
	offAllArea1.style.display = 'block'

//home btn
	goHomeBtn.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupOffall)
	//the add btn
	offAlladd1.innerText = 'add an away schedule'
	offAlladd1.addEventListener('touchstart',addAllOff)
	
	//delete the rows in the offAll gui table
	while (offAllTbl1.rows.length != 1){
		offAllTbl1.deleteRow(1);
	}	
	//re populate the table from the offAllData
	const offL = offAllData.length
	for (i = 0; i < offL; i++) {
		var row = offAllTbl1.insertRow(i+1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var reasonTxt = offAllData[i][0];
		//var reason = '<input type="text" id="fname" name="fname">'
		var reason = '<input type="text" value ='+offAllData[i][0]+' id="reason" name="">'
		var input1 = '<input type="date" value ='+offAllData[i][1]+' id="input1" name="">'
		var input2 = '<input type="date" value ='+offAllData[i][2]+' id="input2" name="">'
		
		cell1.innerHTML = reason
		cell2.innerHTML = input1
		cell3.innerHTML = input2
		cell1.style.backgroundColor = 'white'
		cell2.style.backgroundColor = 'white'
		cell3.style.backgroundColor = 'white'
	}
	
	//del off if there is no offAll rows
	//how many rows in table
	const rt = offAllTbl1.rows.length
	if (offAllTbl1.rows.length > 2) {
		offAllDel1.style.display = 'block'
		} else {
		offAllDel1.style.display = 'none'
	}
	offAllDel1.addEventListener('touchstart',delOffAll)
	
	//add event listeners for the 3 cells in sample	
	awayLable.addEventListener('touchstart',offAllHandler)
	awayStart.addEventListener('touchstart',offAllHandler)
	awayEnd.addEventListener('touchstart',offAllHandler)
	
}

function cleanupOffall() {
	goHomeBtn1.removeEventListener('touchstart',cleanupOffall)
	offAllArea1.style.display = 'none'
	//update the data
	//delete all the prev offAll's
	while (offAllData.length != 0){
		offAlldelUpdate(offAllData[0][0])
	}
	offAllUpdate()
	initHomeDisplay()
	
	awayLable.removeEventListener('touchstart',offAllHandler)
	awayStart.removeEventListener('touchstart',offAllHandler)
	awayEnd.removeEventListener('touchstart',offAllHandler)
	offAllDel1.removeEventListener('touchStart',delOffAll)
	document.removeEventListener("click", delWhat);
}


function addAllOff() {
	//default date
	const date = new Date();
	// Find a <table> element with id="myTable":
	var table = document.getElementById('offAllTbl')

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(1);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);

	// Add some text to the new cells:
	var reasonTxt = 'Your_reason'
	
	const reason = '<input type="text" value ='+reasonTxt+' id="reason" name="">'
	var input1 = '<input type="date" value ='+date+' id="input1" name="">'
	var input2 = '<input type="date" value ='+date+' id="input2" name="">'
	cell1.innerHTML = reason
	cell2.innerHTML = input1
	cell3.innerHTML = input2
	cell1.style.backgroundColor = 'white'
	cell2.style.backgroundColor = 'white'
	cell3.style.backgroundColor = 'white'
}


function offAllHandler() {
	const tbl = document.getElementById('offAllTbl')
	console.log('offAll event > '+event.currentTarget.id)
	const offAllE = event.currentTarget.id
	const firstR = tbl.rows[1].cells;
	
	if (offAllE == 'awayL1') {
		//reason
		//new content for cell
		const reason = '<input type="text" id="fname" name="fname">'
		firstR[0].innerHTML = reason;
		
	}else if (offAllE == 'start1') {
		//start date
		//reason
		
		//new content for cell
		const date = new Date();
		const nc = '<div id="start1" class="allOffcard">' + date + '</div>'
		
		const thisDate = '<form action="/action_page.php">'+
  '<input type="date" id="birthday" name="birthday">'+
	'</form>'
		firstR[1].innerHTML = thisDate;
		
	}else if (offAllE == 'end1') {
		//end date
		const thisDate = '<form action="/action_page.php">'+
  '<input type="date" id="birthday" name="birthday">'+
	'</form>'
	firstR[2].innerHTML = thisDate;
	}
}

function delOffAll() {
	//which row in table has the focus
	document.addEventListener("click", delWhat);
	//make the delete button red
	offAllDel1.style.backgroundColor = 'red'
	
}


function delWhat() {
	var thingClicked = event.currentTarget.activeElement
	var offAllName = thingClicked.value
	var thingToDel = thingClicked.parentElement.parentElement
	var thingId = thingClicked.id
	//ensure that the thing to delete is a row in the allOff table
	if (thingId == 'reason') {
	thingToDel.remove()
	document.removeEventListener("click", delWhat);
	offAllDel1.style.backgroundColor = 'gray'
	//delete the offAll index in the affected days - param index into offAll
	offAlldelUpdate(offAllName)
	}

}


function offAllUpdate() {
	//clear the old data
	offAllData = []
	//how long is the GUI table
	const tblL = offAllTbl1.rows.length;
	for (i = 1; i < tblL; i++) {
		//get 3 values out of table and save in data
		
		//var reason = offAllTbl1.rows[i].cells.item(0).innerHTML
		var reason = offAllTbl1.rows[i].cells.item(0).firstChild.value
		
		//var reason = offAllTbl1.rows[i].cells.item(0).firstChild.value
		var from = offAllTbl1.rows[i].cells.item(1).firstChild.value
		var to = offAllTbl1.rows[i].cells.item(2).firstChild.value
		offAllData.push([reason,from,to])
	}
	//apply the data to the year data base
	const offAlll = offAllData.length
	
	for (i = 0 ; i < offAlll; i++) {
		//the nth array of offAll array
		var offAllName = offAllData[i][0]
		var startDayn = offAllData[i][1]
		var endDay = offAllData[i][2]
		var noDays = getNumberOfDays(startDayn,endDay)
		var dayIndex, mI
		
		//var nextDay = new Date(day)
		
		for (id = 0; id < noDays; id++) {
			var nDay = new Date(startDayn)
			var sDay = new Date(startDayn)
			//do for no off away days			
			nDay.setDate(sDay.getDate() + id);
			//console.log(nDay)
			//get the month index, and the day index
			mI = nDay.getMonth()
			dayIndex = nDay.getDate()-1
			
			//for each of these days load into [3] of Y2022 mask index, index into offAllData
			
			if (y2022[mI][dayIndex][4] != null) {
				//mask array already exists
				if (!y2022[mI][dayIndex][4].includes(i)) {
					//the index to the specified mask does not exist  - put it in
					y2022[mI][dayIndex][4].push(offAllName)
				}
			}else{
				//mask array must be made in [3]
				y2022[mI][dayIndex][4] = [offAllName]
			}
		}
	}
}

function test() {
	const day = new Date("2022-03-23")
	var nDay = new Date("2022-03-23")
	nDay.setDate(day.getDate() + 10)
	console.log(day)
	console.log(nDay)
}


function offAlldelUpdate(name) {
	//remove this mask index from all the affected days
	//get the index into the offAll array by the name
	const l = offAllData.length
	var maskToDel = -1
	//the mask in the offAll array has a name, first item in the array - find it
	for (i = 0; i < l; i++) {
		if (offAllData[i][0] == name) {
			//break if name found
			maskToDel = i;
			break
		}
	}
	if (maskToDel != -1) {	
		//there is a mask to delete
		var startDay = offAllData[maskToDel][1]
		var endDay = offAllData[maskToDel][2]
		var noDays = getNumberOfDays(startDay,endDay)
		var dayIndex, mI
		
		for (id = 0; id < noDays; id++) {
			var day = new Date(startDay)
			var nextDay = new Date(startDay)
			//do for no off away days			
			nextDay.setDate(day.getDate() + id);
			//get the month index, and the day index
			mI = nextDay.getMonth()
			dayIndex = nextDay.getDate()-1
			
			//for each of these days delete the mask name in [4] 
			if (y2022[mI][dayIndex][4] != null) {
				//mask array does exist
				//find the maskToDel in the array and delete it
				const nM = y2022[mI][dayIndex][4].length
				for (i = 0; i <= nM; i++) {
					var it = y2022[mI][dayIndex][4][i]
					if (it == name) {
						//found the maskTodel in the array - delete it
						y2022[mI][dayIndex][4].splice(i,1)
					}
				}
			}else{
				//mask array does not exist	
			}
		}
		//delete the masktoDel from the offAllData array
		offAllData.splice(maskToDel,1)
	}
}

function initialAllOffUpdate() {
	//when data received from HWCD - interpret the allOff masks and update the Y2022 data
	//use the offAllData array
	let maL = offAllData.length
	for (eM = 0; eM < maL; eM++) {
		//for each of the masks - update the y2022 data
		let awayReason = offAllData[eM][0]
		let dAway = offAllData[eM][1]
		let dReturn = offAllData[eM][2]
		let noDaysAway = getNumberOfDays(dAway,dReturn)	
		for (nd = 0; nd < noDaysAway; nd++) {
			//for each date in the date range of the mask - update that day  4th item
			var day = new Date(dAway)
			var nextDay = new Date(dAway)
			nextDay.setDate(day.getDate() + nd);
			mI = nextDay.getMonth()
			dayIndex = nextDay.getDate()-1

			if (y2022[mI][dayIndex][4] != null) {
				//the 4th array exists
				y2022[mI][dayIndex][4].push(awayReason)
			}else {
				//the 4th array does not exist
				y2022[mI][dayIndex].push([awayReason])
			}
		}
	}
}