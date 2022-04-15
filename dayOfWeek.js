//the day of week swipe


function DWmoveStart() {

}

function DWcalcMove() {

}

function drawDayBlocks() {

}

function upDateGui24hr(){
	
	for (let i = 0; i < 24; i++) {
		
		var menuCtx = document.getElementById(i).getContext("2d");
		var thisDay = parseInt(selectedDay)-100
		var selectedHour = i
		
		//get the flame status from this year dataBase
		const flameState = y2022[0][thisDay][i][0]
		
		if (flameState) {
			//the flame on the GUI must be on
			optionsMenu[i][18] = true;
			optionsMenu[i][17] = 'rgb(255, 0, 0)';
			//update the GUI
			drawPzzl(optionsMenu[i],false,false,menuCtx,16)	
		}else{
			//the flame  on the GUI must be off
			optionsMenu[i][18] = false;
			optionsMenu[i][17] = 'rgb(81, 82, 81)';
			drawPzzl(optionsMenu[i],false,false,menuCtx,16)
	}
	}
}


