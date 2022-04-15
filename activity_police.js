//activity police
window.playFrom = 'none'
window.playTo = 'none'
//event handlers
	//goHomeBtn.addEventListener('touchstart',initHomeDisplay)
	//goHomeBtn1.addEventListener('touchstart',handleGoHome)

function handleGoHome() {
	//call cleanup routine per activity
	if (activityId == 'make_schedule_template') {
		//handle the cleanup for make your own schedule and pass nextPlay
		cleanupMakeSchedule(initHomeDisplay)
	}else if (activityId == 'user_defined_schedules') {
		cleanupUserSch(initHomeDisplay)
	}else if (activityId == 'edit_user_schedule') {
		cleanupEditUserSch(initHomeDisplay)
	}
	//init home activity
	//initHomeDisplay()

}

function changePlay() {
	//this handles the event that results in the change of play
	

}