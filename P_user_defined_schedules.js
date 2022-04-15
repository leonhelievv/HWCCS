//this is the play called user defined schedules
var userSchExit
var currentUserSch
//mySchsBtn1.addEventListener('touchstart',showMySch)

const userListSch1 = document.getElementById('userListSch')

function initUserSch() {
	activePlay = 'P_user_defined_schedules'
	activityId = 'user_defined_schedules'
	//prepare the GUI
	//delete the children of userListSch	
	while (userListSch.firstChild) {
    userListSch1.removeChild(userListSch1.firstChild);
	}
	//make new GUI with user Templates
	const uTl = userTemplates.length
	for (uTi = 0; uTi < uTl; uTi++) {
		addScheduleGui(uTi)
	}
	//display the GUI
	userSchArea.style.display = 'block'
	userListSch1.style.display = 'block'
	//change heading to these are your schedules
	playHeader1.innerHTML = phaseHeaders[2]
	//display the home btn
	goHomeBtn1.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupUserSch,true)

}

function cleanupUserSch(userSch) {
	const whatExit = event.path[0].id
	if (whatExit == 'goHomeBtn') {
		//set exitFunction home
		userSchExit = initHomeDisplay
	}else {
		userSchExit = initEditUserSch
	}
	
	//mute all the user schedule stuff
	userSchArea.style.display = 'none'
	userListSch1.style.display = 'none'
	goHomeBtn.style.display = 'none';
	goHomeBtn1.removeEventListener('touchstart',cleanupUserSch,true)
	//exit to next play
	//nextPlay(event)
	userSchExit(userSch)
}


function handleSchTouchEvent(event) {
	console.log('current target id is : ' + event.currentTarget.id)
	console.log(event.currentTarget.innerHTML)
	currentUserSch = event.currentTarget.id
	//this exit to new play do a edit of this schedule
	//cleanupUserSch(initEditUserSch,event)
	cleanupUserSch(event.currentTarget.id)
}


function addScheduleGui(uTi) {
	
	//var guiId = 'sch'+uTi
	var guiId = userTemplates[uTi][0]
	//if guiId already exists - do not duplicate
	const exist = document.getElementById(guiId)
	
	if (exist == null) {
		//does not exist make it
		//var userCard = '<div id = "' +guiId+ '" class="schCard" >'+' <p>'+userTemplates[uTi][0]+'</p>'+'</div>'
		var userCard = '<div id = "' +guiId+ '" class="schCard" style=" margin-bottom: 40px">'+' <p>'+userTemplates[uTi][0]+'</p>'+'</div>'
		var x = document.getElementById("userListSch").childElementCount;
	
		//insert at
			if (x == 0) {
				//it is the user sch - the first card to be created
				entryPoint = document.getElementById('userListSch');
				entryPoint.insertAdjacentHTML('afterbegin', userCard);
	
				console.log(userCard)			
			}else{
				//it is not the first card - use the ID of the previuos card
				//var entry = 'sch'+(x-1)
				//entryPoint = document.getElementById(entry);
				entryPoint = document.getElementById('userListSch').lastElementChild
				entryPoint.insertAdjacentHTML('afterend', userCard);
				//console.log(userCard)
			}
			//add event listener to new entry
			var newEntry = document.getElementById(guiId)
			newEntry.addEventListener('touchstart',handleSchTouchEvent)
		}else{
			console.log('this id already exists '+exist)
		}
}

function showMySch() {
	

}
