//show schedules and assignments


function initshowSchAsigned() {
	activePlay = 'P_show_sch_and_assigns'
	schAndAssignsArea1.style.display = 'block'
	
	//display the home btn
	goHomeBtn1.style.display = 'block';
	//define action for home button
	goHomeBtn1.addEventListener('touchstart',cleanupShowSchAsigned)
	
	//clear the table first
	while (schAndAssigns1.rows.length > 1){
	schAndAssigns1.deleteRow(1);
	}
	//populate the schAndAssigns sA table with schAndAssingments
	let sAL = schAndAssingments.length

	for (saI = 0; saI < sAL; saI++) {
		//for each item is sA - make a row in table schAndAssigns1
		// Create an empty <tr> element and add it to the 1st position of the table:
		var row = schAndAssigns1.insertRow(1);
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		// populate the new cells:
		cell2.innerHTML = schAndAssingments[saI][0]
		//must be the userTemplates name
		//let utN = userTemplates[schAndAssingments[saI][1]][0]
		let utN = userTemplates[schAndAssingments[saI][1]][0]
		cell1.innerHTML = utN
		cell1.style.backgroundColor = 'lightcyan'
		cell2.style.backgroundColor = 'lightcyan'
	}
}

function cleanupShowSchAsigned() {
	schAndAssignsArea1.style.display = 'none'
	initHomeDisplay()
}