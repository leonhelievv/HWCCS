//assign a user defined schedule to all week days - P1asgnUschWd

function initAsgnUschWend() {
	activePlay = 'P_assign_sch_to_weekends'
	console.log('at init assign schedule to week ends')
	//set activity id
	activityId = 'assign_schedule_weekends'
	
	//display heading - make sample hot water schedule
	playHeader1.innerHTML = phaseHeaders[5]

	//display list of your schedules
	userSchArea.style.display = 'block'
	userListSch1.style.display = 'block'
	
	goHomeBtn.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',clnUpAsgnUschWend,true)

	//change the event handlers of all the days
	
	for (i = 0 ; i < userTemplates.length ; i++) {
		var userSch = userTemplates[i][0]
		var eh = document.getElementById(userSch)
		//remove the general handle touch event handler
		eh.removeEventListener('touchstart',handleSchTouchEvent)
		//assign new eventHandler and stop propagation
		eh.addEventListener('touchstart',p1asgnUschWend)
	}
}

function clnUpAsgnUschWend() {
	//asgnUschWdBtn1.style.display = 'none'
	var eh = document.getElementById('sch0')
	//restore the event handlers of the userSch
	for (i = 0 ; i < userTemplates.length ; i++) {
		var userSch = userTemplates[i][0]
		var eh = document.getElementById(userSch)
		//remove the general handle touch event handler
		eh.removeEventListener('touchstart',p1asgnUschWend)
		//assign new eventHandler and stop propagation
		eh.addEventListener('touchstart',handleSchTouchEvent)
	}

	userSchArea.style.display = 'none'
	userListSch1.style.display = 'none'
	goHomeBtn.style.display = 'none'
	feedBack1.style.display = 'none'
	
	goHomeBtn1.removeEventListener('touchstart',clnUpAsgnUschWend,true)
	//feedBack1.style.display = 'none'
	initHomeDisplay()

}

function p1asgnUschWend() {
	var n = event
	var newSchId = event.currentTarget.id
	var userTmplIndex = 'none'
	for (i = 0; i < userTemplates.length; i++) {
		if (userTemplates[i][0] == newSchId) {
			//found the index
			userTmplIndex = i
			break
		}
	}	
	//record the assingment in the schedules and assingments array
	//avoid duplication
	var saL = schAndAssingments.length
	var newPush = true
	for (i = 0; i < saL; i++) {
		var v1 = schAndAssingments[i][0]
		var v2 = schAndAssingments[i][1]
		if (v1 == 'weekends') {
			//there is already a 'weekends', edit it
			schAndAssingments[i][1] = userTmplIndex
			newPush = false		
			}
		}
	if (newPush == true) {
	schAndAssingments.push(['weekends',userTmplIndex])
	}
	
	//replace all weekends 24hr_arrays with the sch 24hrArray
	for (im = 0; im < 12; im++) {
		//do for 12 months
		for (iday = 0; iday < y2022[im].length; iday++) {
			//what day of the week is it
			var dt = (im+1)+','+(iday+1)+',2022'
			var dayWeek = calcDayWeek(dt)
			if (dayWeek == 0 || dayWeek == 6) {
				//it is a weekend		
								
				//replace flame on arrays				
				var sL = userTemplates[userTmplIndex][1].length
				var theUserSch = userTemplates[userTmplIndex][1]	
				//do for all the 'on' arrays				
				for (i = 0; i < sL; i++) {
					y2022[im][iday][1][i] = (userTemplates[userTmplIndex][1][i].slice(0))
				}	
				//replace min max temp array with user template min max array
				y2022[im][iday][2] = userTemplates[userTmplIndex][2].slice(0)		
				//add the name
				y2022[im][iday][2] = userTemplates[userTmplIndex][0]
					
			}
		}
	}
	
	//confirm
	//where to place confirm
	const userSch = document.getElementById(newSchId)
	const cAtx = userSch.offsetLeft
	const cAty = userSch.offsetTop
	confirmOk(cAtx,cAty)
	
}

