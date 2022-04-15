//play - edit user schedules
var flameEMove = false;
var schUnderEdit = 'none'
var schBtnElevent

function initEditUserSch(userSch) {
	activePlay = 'P_edit_user_schedule'
	console.log('at initEditUserSch, event ID is :' + event.currentTarget.id)
	const tI = event.currentTarget.id
	
	var child = document.getElementById(tI);
	var parent = child.parentNode;
	schUnderEdit = Array.prototype.indexOf.call(parent.children, child);
		
	activityId = 'edit_user_schedule'
	//display heading - make sample hot water schedule
	playHeader1.innerHTML = phaseHeaders[3]
	nameOfSch.style.display = 'block'
	areaSchedule.style.display = 'block'
	makeSchArea.style.display = 'block'
	goHomeBtn.style.display = 'block';
	deleteBtn1.style.display = 'block';
	hours24a.style.display = 'block';
	schSubmit.style.display = 'block';
	
	//this button goes to another play
	
	schBtnElevent = event
	schSubmit1.addEventListener('touchstart',cleanupEditUserSch)
	
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupEditUserSch,true)
	
	//define action for delete button
	deleteBtn1.addEventListener('touchstart',deleteUserSch,true)
	
	//if the optionsMenu does not exist make it 
	const no24hrChildren = hours24a.childElementCount;
	if (optionsMenu.length == 0) {
 		//there is no 24_hour_optionsMenu		
 		construct24hOptions(p24h)
 	}
 	//if the flame GUI does not exist make it 
 	if (no24hrChildren == 0) {
 		//there is no GUI
 		construct24hGui(p24h)
 	}
	//do the edit
	editSchedule(event)
	
	//add event listeners to the flames	
	addEditFlameEL()
	
	//add event listeners to min max sliders
	minTemp1.addEventListener('change',editMinMax)
 	maxTemp1.addEventListener('change',editMinMax)
 	
 	//add event listener for editing the name of the sch
 	theSchName1.addEventListener('touchstart',editSchName)
	
}


function cleanupEditUserSch() {
	//what event submit or home	
	(event.currentTarget.id == 'goHomeBtn') ? exitFnc = initHomeDisplay : exitFnc = initUserSch;
		
	nameOfSch.style.display = 'none'
	areaSchedule.style.display = 'none'
	makeSchArea.style.display = 'none'
	goHomeBtn.style.display = 'none';
	minMaxT1.style.display = 'none'
	deleteBtn1.style.display = 'none';
	hours24a.style.display = 'none';
	schSubmit.style.display = 'none';
	//delete btn event listener
	schSubmit1.removeEventListener('touchstart',cleanupEditUserSch)
	
	//delete the flame eventlisteners
	delEditFlameEL()
	//remove event listeners to min max sliders
	minTemp1.removeEventListener('change',editMinMax)
 	maxTemp1.removeEventListener('change',editMinMax)
	schUnderEdit = 'none'
	//remove home btn event listener
	goHomeBtn1.removeEventListener('touchstart',cleanupEditUserSch,true)
	//exit to the specified play
	exitFnc()
}

function editSchedule(event) {
	
	const tI = event.currentTarget.id
	const schHtml = event.currentTarget.innerHTML
	var n
	//calc the number of the schedule to use 
	//const n = parseInt(tI.replace('sch',''))
	const noUserSch = userTemplates.length
	for (i = 0; i < noUserSch; i++) {
		//if (schHtml.includes(userTemplates[i][0])) {
		if (tI == userTemplates[i][0]) {
			//the name is a match
			n = i
			break
		}
	}
	console.log('the name of the user schedule to be eddited is : '+ userTemplates[n][0])
	console.log('the number of the user schedule to be eddited is : ' + n)
	schUnderEdit = n
	nameOfSch.innerHTML = userTemplates[n][0]
	//first reset the optionsMenu to all off
	for (o = 0; o < 24; o++) {
		optionsMenu[o][17] = 'rgb(81, 81, 81)'
		optionsMenu[o][18] = false
	}
	//interpret the userSch and update flame data in optionsMenu
	//how many arrays in this userTemplate
	const noArrays = userTemplates[n][1].length
	for (i = 0; i < noArrays; i++) {
		//for each of the ranges - update optionsMenu
		var startHr = userTemplates[n][1][i][0]
		var endHr = userTemplates[n][1][i][1]
		for (hr = startHr; hr <= endHr; hr++) {
			optionsMenu[hr][17] = 'rgb(255, 0, 0)'
			optionsMenu[hr][18] = true
		}
	}
	
	//the GUI must be re built with the new data in the flame arrays
	//const p24h = [5,20]
	//construct24h(p24h) //this sets the event listeners to what ? - not
	construct24hGui(p24h)
	//load the min and max temp into sliders and display them
	const minT = userTemplates[n][2][0]
	const maxT = userTemplates[n][2][1]
	document.getElementById('minTemp').value = minT
	document.getElementById('maxTemp').value = maxT
	minMaxT1.style.display = 'block'
}

function flameEts() {
	//if move then do not change flame status
	flameEMove = false;
}
	
function flameEtm() {
	//if move then do not change flame status
	flameEMove = true;
}
	

function editFlameHandler() {
	
	if (flameEMove == false) {
		//no move
		console.log('at edit flame handler '+event.currentTarget.id)
		//set as selected option to draw on main canvas
		//find the menuItem in menuItems array by ID
		const menuOptionsIndex = findMenuItem(event.currentTarget.id)
		var newOn = menuOptionsIndex
		selectedHour =  optionsMenu[menuOptionsIndex]
		var menuCtx = document.getElementById(selectedHour[1]).getContext("2d");
		
		if (selectedHour[18]) {			
			//update the user schedule now in play		
			//userTemplates[schUnderEdit][1][menuOptionsIndex] = false
			//off may have broken one of the usertemplates
			//find in usertemplates[schUnderEdit][1] overlap
			var schLs = userTemplates[schUnderEdit][1].length
			for (i = 0; i < schLs; i++) {
				//loop through on arrays to find if broken by false
				var onFrom = userTemplates[schUnderEdit][1][i][0]
				var onTo = userTemplates[schUnderEdit][1][i][1]
				var newOff = menuOptionsIndex
				if (newOff > onFrom && newOff < onTo) {
					//this 'on's' was broken by off - falls inside from-to
					//adjust this 'on' array - split into two
					var new1 = [onFrom, newOff-1]
					var new2 = [newOff+1,onTo]
					//pop the old array - push the new ones
					var old = userTemplates[schUnderEdit][1].splice(i,1)
					userTemplates[schUnderEdit][1].splice(0,0,new1,new2)
				}else if (onFrom == onTo && onFrom == newOff) {
					//[4,4] and new off is 4 then splice the array out
					old = userTemplates[schUnderEdit][1].splice(i,1)
					console.log('delete userSchedule from userTemplates '+old)
					//there is now one schedule less - so ajust 
					schLs = userTemplates[schUnderEdit][1].length
				}else if (newOff == onTo) {
					//new off is equal to the old last on
					//make array one smaller - remove last on
					userTemplates[schUnderEdit][1][i][1] = onTo-1
				}else if (newOff == onFrom) {
					//new off is equal to the old first on
					//make array one smaller - remove first on
					userTemplates[schUnderEdit][1][i][0] = onFrom+1
				}
			}
			//the flame is on - turn off
			selectedHour[18] = false;
			selectedHour[17] = 'rgb(81, 82, 81)';
			//update the GUI
			drawPzzl(selectedHour,false,false,menuCtx,16)
			
			console.log('the sch :'+schUnderEdit)
		}else{
			//the flame is off - turn on
			selectedHour[18] = true;
			selectedHour[17] = 'rgb(255, 0, 0)';
			//update the GUI
			drawPzzl(selectedHour,false,false,menuCtx,16)
			
			//userTemplates[schUnderEdit][1][menuOptionsIndex] = true
			
			//the new 'on' could join already on's or be stand alone
			//find if a join, if not make new array [newOn,newOn]
			var schLs = userTemplates[schUnderEdit][1].length
			var onHandled = false
			for (i = 0; i < schLs; i++) {
				//loop through on arrays to find if 'on' should join other on's
				var onFrom = userTemplates[schUnderEdit][1][i][0]
				var onTo = userTemplates[schUnderEdit][1][i][1]
				
				var jointed = newOnBetween2(newOn,schUnderEdit)
				if (jointed[0].length != 0) {
					//it is a jointer
					//delete both those jointed
					//make the big-er index del1 - to delete first - the array will shorten without affecting del2
					if (jointed[1][0] > jointed[1][1]) {
						var del1 = jointed[1][0]
						var del2 = jointed[1][1]
					}else {
						del2 = jointed[1][0]
						del1 = jointed[1][1]
					}
					userTemplates[schUnderEdit][1].splice(del1,1)
					userTemplates[schUnderEdit][1].splice(del2,1)
					onHandled = true
					//put in the jointed array
					userTemplates[schUnderEdit][1].splice(0,0,jointed[0])
					//the list is now one shorter - ajust schLs
					schLs = userTemplates[schUnderEdit][1].length
				}else if (newOn == onFrom-1) {
					//this 'on' must join at the front				
					userTemplates[schUnderEdit][1][i][0] -= 1
					onHandled = true	
				}else if (newOn == onTo+1) {
					//this 'on' must join at the back			
					var v = userTemplates[schUnderEdit][1][i][1]
					v = v+1
					userTemplates[schUnderEdit][1][i][1] = v
					onHandled = true
				}else {
					// new 'on' is not next in front or behind
				}
			}
			if (onHandled == false) {
				//on was not handled - make new array [newOn,Newon]
				const newSch = [newOn,newOn]
				userTemplates[schUnderEdit][1].splice(0,0,newSch)
			}

			}
	}

}

function newOnBetween2(newOn,scUnderEdit) {
	const  uL = userTemplates[schUnderEdit][1].length
	var iOne = 'none'
	var iTwo = 'none'
	var joint = [[],[]]
	for (i1 = 0 ; i1 < uL; i1++) {
		if (newOn+1 == userTemplates[schUnderEdit][1][i1][0]) {
			//there is a match for newOn+1
			iOne = i1
		}
		//is this a match for mewOn-1
		if (newOn-1 == userTemplates[schUnderEdit][1][i1][1]) {
			//there is a match for newOn-1
			iTwo = i1
		}
	}
	//are there 2 matches ?
	if (iOne != 'none' && iTwo != 'none') {
		//newOn is between two 'on's'
		
		//join the [match_iOne] newOn [match_iTwo]
		joint[0][0] = userTemplates[schUnderEdit][1][iTwo][0]	
		joint[0][1] = userTemplates[schUnderEdit][1][iOne][1]
		joint[1][0] = iOne
		joint[1][1] = iTwo
		}
	return joint
}

function delEditFlameEL() {
	for (fI=0; fI < 24; fI++) {
		var flameE = document.getElementById(fI)
		flameE.removeEventListener('touchstart',flameEts)//,{passive: true})
		flameE.removeEventListener('touchmove',flameEtm)//,{passive: true})
		//flameE.removeEventListener('touchend',editFlameHandler.bind(event,0))//,{passive: true})
		flameE.removeEventListener('touchend',editFlameHandler)//,{passive: true})
	}

}

function addEditFlameEL() {
	for (fI=0; fI < 24; fI++) {
		var flame = document.getElementById(fI)
		flame.addEventListener('touchstart',flameEts)//,{passive: true})
		flame.addEventListener('touchmove',flameEtm)//,{passive: true})
		//flame.addEventListener('touchend',editFlameHandler.bind(event,n,true))//,{passive: true})
		flame.addEventListener('touchend',editFlameHandler)//,{passive: true})
				
	}

}

function deleteUserSch() {
	//del from user schedule data
	const schName = userTemplates[schUnderEdit][0]
	userTemplates.splice(schUnderEdit,1)
	//del from GUI - which GUI
	//find the GUI with the name in <p> ---<p/>
	//const sch = document.getElementById('sch'+schUnderEdit)
	const sch = document.getElementById(schName)
	sch.remove()
	cleanupEditUserSch()
	
}

function editMinMax() {
	console.log(event.currentTarget.id)
	const mMe = event.currentTarget.id
	const v = event.currentTarget.value
	if (mMe == 'minTemp') {
		//minimum was changed - change GUI text with value
		minTtxt1.innerHTML = 'your minimum temprature is : '+v
		//update the userSch
		userTemplates[schUnderEdit][2][0] = parseInt(document.getElementById('minTemp').value)
	
	}else if (mMe == 'maxTemp') {
		//max was changed
		maxTtxt1.innerHTML = 'your maximum temprature is : '+v
		//update the user sch
		userTemplates[schUnderEdit][2][1] = parseInt(document.getElementById('maxTemp').value)
	}
}	
	
function editSchName() {
	//display again the name input element inputName
	inputName1.style.display = 'block'
	//assign eventlistener for key
	nameInput.addEventListener('keyup', editName)
	
}

function editName() {
	
	if (event.keyCode == 13) {
		//what is old name
		const oldName = userTemplates[schUnderEdit][0]
		//what is the new name - value of 
		const newName = inputName.value
		//the schUnderEdit name must be changed
		
		//the userTemplates, [under edit][0] <- new name
		userTemplates[schUnderEdit][0] = newName
		
		//the card must be removed
		const theCard = document.getElementById(oldName)
		theCard.remove()
		
		//create new card with new name
		addScheduleGui(schUnderEdit)
		
		inputName1.style.value = ''
		inputName1.style.display = 'none'
		
		//update GUI sch name
		theSchName1.innerHTML = newName
		
		console.log('the card is ' +theCard)
	}
}
