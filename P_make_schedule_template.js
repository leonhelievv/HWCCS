//make schedule template

var activeTemplate = 'none'
var mschExitFunc

const areaSchedule = document.getElementById('scheduleArea')
const nameInput = document.getElementById('inputName')
const nameOfSch = document.getElementById('theSchName')
const userSchArea = document.getElementById('userListSch')
const makeSchArea = document.getElementById('makeDaySchedule')
const nameSubmit1 = document.getElementById('nameSubmit')

const minTemp1 = document.getElementById('minTemp')
const maxTemp1 = document.getElementById('maxTemp')

const minTtxt1 = document.getElementById('minTtxt')
const maxTtxt1 = document.getElementById('maxTtxt')


//nameInput.addEventListener('onclick',nameSchedule)
//dayWeekRolodex.addEventListener('touchmove',dayRolodexMove)
//dayWeekRolodex.addEventListener('touchend',dayRolodexEnd)

function initMakeSchedule() {
	activePlay = 'P_make_schedule_template'
	console.log('at init make schedule')
	//set activity id
	activityId = 'make_schedule_template'
	//if not already made construct the 24 hour GUI
	//const no24hrChildren = document.getElementById('hours24a').childElementCount;
	const no24hrChildren = hours24a.childElementCount;
	console.log('is there a 24hr GUI ? : '+no24hrChildren)

 	if (optionsMenu.length == 0) {
 		//there is no 24_hour_optionsMenu		
 		construct24hOptions(p24h)
 	}
 	
 	if (no24hrChildren == 0) {
 		//there is no GUI
 		construct24hGui(p24h)
 	}
 	
 	//add flame event listeners
 	addMakeSchFlameEL()

	//set up stage
	goHomeBtn1.style.display = 'block';
	makeDaySchedule.style.display = 'block'
	nameInput.style.display = 'block'
	makeSchArea.style.display = 'block'
	scheduleArea1.style.display = 'block'
	
	//display heading - make sample hot water schedule
	playHeader1.innerHTML = phaseHeaders[1]
	nameInput.value = ''
	nameInput.placeholder = 'type a name here'
	//set default schedule name
	nameOfSch.innerHTML = 'My new schedule'
	
	//add event listener - enter key - nameInput
	nameInput.addEventListener('keyup', nameInEnter)
	nameSubmit1.addEventListener('touchstart',nameSchedule)
	
	//this button goes to another play	
	schSubmit1.addEventListener('touchstart',cleanupMakeSchedule,true)
	
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupMakeSchedule,true)
		
	//display the call out box with instruction
	
}

function cleanupMakeSchedule() {
	
	const whatExit = event.path[0].id
	console.log('what exit ? : '+whatExit)
	//submit the schedule
	if (whatExit == 'schSubmit') {
		//what exit was schSubmit
		submitSchedule()
		//set exitFunction
		mschExitFunc = initUserSch
	}else if (whatExit == 'goHomeBtn'){
		//set exitFunction home
		mschExitFunc = initHomeDisplay
	}
	//mute all the make schedule template stuff
	makeDaySchedule.style.display = 'none'
	nameInput.style.display = 'none'
	nameSubmit1.style.display = 'none'
	makeSchArea.style.display = 'none'
	hours24a.style.display = 'none'
	schSubmit.style.display = 'none'
	
	minMaxT1.style.display = 'none'
	minTemp1.removeEventListener('change',checkMinMax)
 	maxTemp1.removeEventListener('change',checkMinMax)
	
	//del btn event listener
	schSubmit1.removeEventListener('touchstart',cleanupMakeSchedule,true)
	goHomeBtn1.removeEventListener('touchstart',cleanupMakeSchedule,true)
	nameInput.removeEventListener('keyup', nameInEnter)

	//del flame event listeners
	delMakeSchFlameEL()
	//exit
	//initUserSch()
	mschExitFunc()
}

function nameSchedule() {
		var theName = inputName.value
		console.log('at name the schedule '+theName)
		
		//test if name already exists - do nothing
		const sameName = (element) => element.includes(theName);
		const nI = userTemplates.findIndex(sameName)
		
		if (nI == -1) {
			//the name does not exist - make it
			//mute the name input and 
			nameOfSch.style.display = 'none'
			nameInput.style.display = 'none'
		
			//display name as label
			nameOfSch.innerHTML = theName
			nameOfSch.style.display = 'block'
		
			//make user template data entry
			userTemplates.push([theName,[],[]])
			activeTemplate = theName
			//construct 24h period
 			//const p24h = [5,20]
 			//if (optionsMenu.length == 0) {
 				//the optionsMenu is empty array
 			//	construct24h(p24h)
 			//}
 		
 		//display the 24 hour schedule
 		//document.getElementById('optionBlks').style.display = 'block'
 		hours24a.style.display = 'block'
 		
 		//display a submit button
 		schSubmit1.style.display = 'block'
 		
 		//display the min max temp inputs
 		minMaxT1.style.display = 'block'

 		minTemp1.addEventListener('change',checkMinMax)
 		maxTemp1.addEventListener('change',checkMinMax)
 		
 		//mute the submit name
 		nameSubmit1.style.display = 'none'
 		//clear the input element
 		inputName1.value = ''
 		}	else {
 			//the name already exists mark text red
 			console.log('name already exists, the index is : ' +nI)
 			nameInput.style.color = 'red'
 				
 		}
	}
	
function checkMinMax() {
	console.log(event.currentTarget.id)
	const mMe = event.currentTarget.id
	const v = event.currentTarget.value
	const template = (element) => element.includes(activeTemplate);
	const tI = userTemplates.findIndex(template)
	if (mMe == 'minTemp') {
		//minimum was changed - change text with value
		minTtxt1.innerHTML = 'your minimum temprature is : '+v
		//update the userSch
		userTemplates[tI][2][0] = parseInt(document.getElementById('minTemp').value)
	
	}else if (mMe == 'maxTemp') {
		//max was changed
		maxTtxt1.innerHTML = 'your maximum temprature is : '+v
		//update the user sch
		userTemplates[tI][2][1] = parseInt(document.getElementById('maxTemp').value)
	}
}	
	
	
function submitSchedule() {
	console.log('at submit schedule')
	//get the index of the active user schedule
	const currentTemplate = (element) => element.includes(activeTemplate);
	const tI = userTemplates.findIndex(currentTemplate)
	if (tI != -1) {
		//there is a userTemplate
	var prevTemplate
	//console.log(userTemplates.findIndex(currentTemplate));
	console.log('the newly submitted schedule is '+tI);
	//update the user schedule with 24 flame on/off
	
/*
userTemplates[this Template][1][the off from,to] has array's of from and to hours range 0 - 23
[6,8],[15,19]
this mean's that the flame will be on from 6:00 to 8:00 and from 15:00 to 19:00
all other times flame is off

if there is a mask it could override the flame status
*/	
	var onBuild = false
	var onFrom = ''
	var onTo = ''
	for (i = 0; i < 24; i++) {
		var flameState = optionsMenu[i][18]
		
		if (flameState == true) {
			if (onBuild == false) {
				//onBuild starts
				onBuild = true
				onFrom = i
			}else {
				//onBuild already going							
			}
		
		}else {
			//the flame state is off
			if (onBuild == true) {
				//the build is on - stop record the 'onTo' - save in userTemplates
				onTo = i-1
				onBuild = false
				userTemplates[tI][1].push([onFrom,onTo])
				onFrom = ''
				onTo = ''
			}else {
				//the build is not on - ignore
			}
		}
		//userTemplates[tI][1][i] = optionsMenu[i][18] //old methode
	}
	//update user Schedule with min max temp
	userTemplates[tI][2][0] = parseInt(document.getElementById('minTemp').value)
	userTemplates[tI][2][1] = parseInt(document.getElementById('maxTemp').value)
		
	//if the schedule did not exist before - updatethe GUI
	//add to the schedule GUI
	addScheduleGui(tI)
}
}

function addMakeSchFlameEL() {
	for (fI=0; fI < 24; fI++) {
	var flamenS = document.getElementById(fI)
	flamenS.addEventListener('touchstart',h24Start)//,{passive: true})
	flamenS.addEventListener('touchmove',h24Swipe)//,{passive: true})
	flamenS.addEventListener('touchend',flameHandler)//,{passive: true})
	}

}

function delMakeSchFlameEL() {
	for (fI=0; fI < 24; fI++) {
	var flamenS = document.getElementById(fI)
	flamenS.removeEventListener('touchstart',h24Start)//,{passive: true})
	flamenS.removeEventListener('touchmove',h24Swipe)//,{passive: true})
	flamenS.removeEventListener('touchend',flameHandler)//,{passive: true})
	}

}

function nameInEnter() {
	console.log('name input key up > ' + event.keyCode)
	if (event.keyCode == 13) {
		nameSchedule()
	}
	nameSubmit1.style.display = 'block'
}
